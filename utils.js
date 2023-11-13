import fs from 'fs'
import path from 'path'
import * as url from 'url';
import { ChatGPTAPI } from 'chatgpt'

let apiKey = ""; //use this if not using CLI

const systemMessage = `As an expert developer, your task is to analyze, understand, and document source code for comprehensive developer documentation. Your audience is entry to mid-level developers with a foundational grasp of programming concepts, languages, and techniques.

You will receive source code from applications or libraries, starting with the most critical files. Your documentation should build upon each file's context, forming cohesive, well-articulated Markdown documents. Aim for clarity and conciseness, tailoring your explanations to your intelligent audience.

For each file, provide:

A high-level summary explaining its purpose and role.
Detailed documentation of all methods, including:
Input parameters.
Output values.
General use cases and examples.
If a file does not serve as an API and its functionality is straightforward, a concise summary of one or two paragraphs, or a few bullet points, will suffice.

Your output will be directly converted into a Markdown (.md) file. Therefore, ensure your documentation is structured for immediate use as developer documentation, with clarity and precision as its cornerstones.`;

const API_KEY_FILE = path.join(url.fileURLToPath(new URL('.', import.meta.url)), 'apiKey.txt');
// Function to set the API key and save it to a file
export function setApiKey(apiKey) {
    fs.writeFileSync(API_KEY_FILE, apiKey, 'utf8');
}

// Function to get the API key from the file
export function getApiKey() {
    if (fs.existsSync(API_KEY_FILE)) {
        return fs.readFileSync(API_KEY_FILE, 'utf8');
    } else return apiKey;
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
  setApiKey(args.apiKey);
} else apiKey = getApiKey();


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