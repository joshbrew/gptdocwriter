import fs from 'fs'
import path from 'path'
import { ChatGPTAPI } from 'chatgpt'

let apiKey = ""; //use this if not using CLI

const systemMessage = `You are an expert developer tasked with reading and documenting source code for creating developer documentation that assumes the reader is an entry 
to mid-level developer who is familiar with programming languages and conventions and techniques. 
You are fed app or library source code starting with the most important files and you will document then build on the context of each file to produce even better, well-written and cohesive markdown documents for each file you are given. Weave together the explanations best you can as files add up. 
This will include a high level summary of the purpose of the file and then document all of the methods and their inputs, outputs, and general use case. If it's clearly not meant as an API, you can summarize into 1 or 2 paragraphs or a few bullet points.

Your output will be parsed into a markdown file, so write your response assuming it will be readable as a .md file to be used out of the gate for developer documentation, so be very concise and assume your reader is very intelligent!
`;

const API_KEY_FILE = path.join(import.meta.url, 'apiKey.txt');

// Function to set the API key and save it to a file
export function setApiKey(apiKey) {
    fs.writeFileSync(API_KEY_FILE, apiKey, 'utf8');
}

// Function to get the API key from the file
export function getApiKey() {
    if (fs.existsSync(API_KEY_FILE)) {
        return fs.readFileSync(API_KEY_FILE, 'utf8');
    } else return apiKey;
    return null;
}

export const get = (args=process.argv) => {
  const argMap = {}
  args.forEach((v,i) => {

      if (v.startsWith('--')) {
          const key = v.replaceAll('-', '').trim()
          if(!args[i+1].startsWith('--') && !args[i+1].includes('=')) 
              argMap[key] = args[i+1]; //assumes next non-command arg is a value when using dashes
      } 
      else if (v.includes('=')) {
          let split = v.split('=');
          const key = split[0];
          argMap[key] = split[1];
      }
      else argMap[v] = true;
  })

  return argMap;
}

// Parse CLI arguments
export const args = get();

// Set API key if provided
if (args.apiKey) {
  apiKey = args.apiKey;
}

apiKey = getApiKey();

console.log("Initializing ChatGPTAPI");

export const api = new ChatGPTAPI({
  apiKey:apiKey ? apiKey : process.env.OPENAI_API_KEY,
  systemMessage,
  completionParams: {
    model: 'gpt-4-1106-preview', //wheeeeeee
  }
});


let lastLength = 0;

export async function ask (
    text, 
    onProgress=(partialResponse, lastLength) => {
        console.log(partialResponse.text.substring(lastLength));
        curLength = partialResponse.text.length;
    },
    parentMessageId
) {  
  let options = {}
  if(onProgress) options.onProgress = onProgress;
  if(parentMessageId) options.parentMessageId = parentMessageId;
  return await api.sendMessage(text,options);
}


export async function generateReadme(entryPoint, onProgress, parentMessageId) {
  try {
      console.log("Generating README.md")
      // Create a system message for generating README content
      const readmeContent = (await ask("Place README.md contents here. Include directory of markdown files.", onProgress, parentMessageId)).text;

      // Define path for README.md
      const readmePath = path.join(entryPoint, 'documentation', 'README.md');

      // Write the README file
      fs.writeFileSync(readmePath, readmeContent);
      console.log("README.md generated at: ", readmePath);
  } catch (error) {
      console.error("Error in generateReadme: ", error);
  }
}


export async function generateDocumentation(
    entryPoint = process.cwd(), 
    initialFiles = [], 
    fileExtensions = ['.js', '.ts', '.mjs', '.jsx', '.tsx'], 
    excluded = ['dist','node_modules'],
    onProgress = null
) {
    const initialFullPaths = initialFiles.map(file => path.join(entryPoint, file));

    let parentMessageId;
    async function readFiles(dir) {
      try {
        const files = fs.readdirSync(dir);
        for (let file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);

          if (excluded.some(excludedDir => fullPath.includes(excludedDir)) ||
              initialFullPaths.includes(fullPath)) {
              continue;
          }

          if (stat.isDirectory()) {
            await readFiles(fullPath);
          } else if (fileExtensions.includes(path.extname(file))) {
            console.log("Documenting file: ", fullPath);
            let documentation = await documentFile(fullPath, parentMessageId);
            //console.log(documentation?.id);
            if(documentation) parentMessageId = documentation.id;
          }
        }
      } catch (error) {
        console.error("Error in readFiles: ", error);
      }
    }

    async function documentFile(filePath, parentMessageId) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const documentation = (await ask("Path: " + filePath + "; File Content: "+content, onProgress, parentMessageId));

        writeDocumentation(filePath, documentation.text);

        return documentation;
      } catch (error) {
        console.error("Error in documentFile: ", error);
      }
    }

    function writeDocumentation(originalFilePath, documentation) {
      try {
        const relativePath = path.relative(entryPoint, originalFilePath);
        const docFilePath = path.join(entryPoint, 'documentation', `${relativePath}.md`);

        const docDir = path.dirname(docFilePath);
        if (!fs.existsSync(docDir)) {
          fs.mkdirSync(docDir, { recursive: true });
        }

        fs.writeFileSync(docFilePath, documentation);
        console.log("Documented to: ", docFilePath);
      } catch (error) {
        console.error("Error in writeDocumentation: ", error);
      }
    }

    for (let file of initialFullPaths) {
      console.log("Documenting file: ", file);
      let documentation = await documentFile(file, parentMessageId);
      if(documentation) parentMessageId = documentation.id;
    }

    //document all files
    await readFiles(entryPoint);

    // After documenting all files, generate README.md
    await generateReadme(entryPoint, onProgress, parentMessageId);
}

//   // Example usage
//generateDocumentation(); // You can pass parameters as needed