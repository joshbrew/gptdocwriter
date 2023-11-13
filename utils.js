import fs from 'fs'
import path from 'path'
import * as url from 'url';

import OpenAI from 'openai';

let apiKey = ""; //use this if not using CLI

const instructions = `
You are receiving source code from applications or libraries, starting with the most critical files in order to recursively document source code for comprehensive developer documentation. 
Your documentation should build upon each file's context as you are fed them in the conversation, forming cohesive, well-articulated Markdown documents. Your responses will be parsed as if they were markdown files for each file you are given.
Assume your responses will sit in a documentation folder on the repository, mirroring the repository structure, and should look like any other detailed, easily readable markdown documentation.
`;

//get command line args either "--key value" or "key=value"
export const getArgs = (args = process.argv) => {
  const argMap = {};
  args.forEach((v, i) => {
    if (v.startsWith('--')) {
      const key = v.replace(/^-+/g, '').trim(); // Remove all leading dashes
      if (args[i + 1] && !args[i + 1].startsWith('--')) {
        const value = args[i + 1].includes(',') ? args[i + 1].split(',').map(item => item.trim()) : args[i + 1];
        argMap[key] = value; // Handle array-like arguments
      }
    } else if (v.includes('=')) {
      let split = v.split('=');
      const key = split[0].replace(/^-+/g, '').trim(); // Remove leading dashes from key
      const value = split[1].includes(',') ? split[1].split(',').map(item => item.trim()) : split[1];
      argMap[key] = value; // Handle array-like arguments
    } else {
      argMap[v] = true;
    }
  });

  return argMap;
};

// Parse CLI arguments
export const args = getArgs();


//define --model gpt-4 etc. Note: not free
const model = args.model ? args.model : 'gpt-4-1106-preview';//'gpt-4';//8k //'gpt-3.5-turbo-1106' //16k //'gpt-4-1106-preview'; //128k




const CONFIG_FILE = path.join(url.fileURLToPath(new URL('.', import.meta.url)), 'config.txt');

// Function to set the API key and Assistant ID and save them to a file
export function setConfig(apiKey, assistantId, threadId) {
  let existingConfig = {};

  // Check if the config file exists and read it
  if (fs.existsSync(CONFIG_FILE)) {
      const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
      configData.split('\n').forEach(line => {
          const [key, value] = line.split('=');
          if (key) {
              existingConfig[key.trim()] = value.trim();
          }
      });
  }

  // Update the existing config with new values if provided
  if (apiKey) existingConfig['API_KEY'] = apiKey;
  if (assistantId) existingConfig['ASSISTANT_ID'] = assistantId;
  if (typeof threadId !== 'undefined') {
    if(threadId === false) delete existingConfig['THREAD_ID'];
    else existingConfig['THREAD_ID'] = threadId;
  }

  // Prepare the config data for writing
  const configDataToWrite = Object.entries(existingConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

  // Write the updated config data to the file
  fs.writeFileSync(CONFIG_FILE, configDataToWrite, 'utf8');
}

// Function to get the API key and Assistant ID from the file
export function getConfig() {
    if (fs.existsSync(CONFIG_FILE)) {
        const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
        const configLines = configData.split('\n');
        const config = {};

        configLines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                config[key.trim()] = value.trim();
            }
        });

        return config;
    } else {
        return {};
    }
}

// Use getConfig to retrieve the API key and Assistant ID
const { API_KEY, ASSISTANT_ID, THREAD_ID } = getConfig();


// Set API key if provided
if (args.apiKey) {
  apiKey = args.apiKey;
  setConfig(apiKey);
} else if(!apiKey) apiKey = API_KEY;

console.log("Running GPT Doc generator with model", model);

let rateLimitSec = 0;

let maxModelTokens = 4096;
let maxResponseTokens = 4096;

if(model === 'gpt-4-1106-preview') { //hack
  maxModelTokens = 128e3; //128e3
  maxResponseTokens = 4e3;
  //rateLimitSec = 12;
} else if (model === 'gpt-4') {
  maxModelTokens = 8e3;
  maxResponseTokens = 4e3;
} else if (model === 'gpt-3.5-turbo-1106') {
  maxModelTokens = 16e3;
  maxResponseTokens = 16e3;
}

const openai = new OpenAI({
  apiKey, // defaults to process.env["OPENAI_API_KEY"]
});

let assistantId = ASSISTANT_ID;
let lastThreadId = THREAD_ID;

// Function to interact with a chosen OpenAI model using a prompt and a system message
// Optionally streams data with an onProgress callback
export async function ask({
  model = 'gpt-3.5-turbo-16k', // Default model
  prompt,
  instructions,
  threadId,
  deleteThread=true, //default true
  deleteAssistant=false //delete assistant?
}) {
  try {
    
      // Standard response
      if(lastThreadId) {
        await openai.beta.threads.del(lastThreadId); //makes sure aborted threads are cleared
        setConfig(undefined,undefined,false); lastThreadId = undefined;
      }
      //Create an assistant and thread to interact with GPT models
      
      if(!assistantId) {
        let assistants = await openai.beta.assistants.list({});
        if(!assistants?.data?.find((a) => {
          if(a.name === "The god of docs.") {
            assistantId = a.id;
            return true;
          }
        })) assistantId = (await openai.beta.assistants.create({
          name:"The god of docs.",
          model,
          instructions,
          //tools
        })).id;
        setConfig(apiKey,assistantId);
      }

      if(!threadId) {
        let thread = await openai.beta.threads.create({});
        threadId = thread.id;
        setConfig(undefined,undefined,threadId);
      }

      if(prompt.length > 32e3) { //GPT will be limited to its context window size for the most recent messages
        // Function to split the message into chunks of 32K characters
        function splitMessage(message, maxChunkSize = 30000) {
          const chunks = [];

          for (let i = 0; i < message.length; i += maxChunkSize) {
            const chunk = message.substring(i, i + maxChunkSize);
            chunks.push(chunk);
          }

          return chunks;
        }

        // Function to send the message in chunks if necessary
        async function sendMessageInChunks(threadId, prompt) {
          const messageChunks = splitMessage(prompt);

          let i = 0;
          for (const chunk of messageChunks) {
            const params = {
              role: "user",
              content: `Part ${i} of ${messageChunks.length} ${chunk}`
            };

            // Send each chunk as a separate message
            await openai.beta.threads.messages.create(threadId, params);
            await new Promise((res)=>{setTimeout(()=>{res(true)},100)}); //give it a moment, IDK might help limit failure rates on larger requests
          }
        }

        await sendMessageInChunks(threadId, prompt);
      } else {
        const params = {
          role:"user",
          content:prompt
        };
  
        //Send the message
        let newMessage = await openai.beta.threads.messages.create(threadId, params);
  
      }

      await new Promise((res)=>{setTimeout(()=>{res(true)},100)}); //give it a moment, IDK might help limit failure rates on larger requests
      //Create a run with the GPT model
      let threadRun = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId
      });
      
      let pollPeriod = 1000; //poll once per sec
      let retries = 2;

      let completed = await new Promise((res,rej) => {
        let numRetries = 0;
        let poll = async () => {
          
          let run = await openai.beta.threads.runs.retrieve(threadId, threadRun.id);
          if(run.completed_at) {
            res(true)
          } else if (run.cancelled_at || run.failed_at) {
            numRetries++;
            if(numRetries > retries)
              res(run);
            else if(run.failed_at) {
              console.log("Run failed, retrying", run);
              await new Promise((res)=>{setTimeout(()=>{res(true)},100)}); //give it a moment
              threadRun = await openai.beta.threads.runs.create(threadId, { 
                assistant_id: assistantId
              }); //retry if failed
            }
            
          }
          else setTimeout(()=>{poll()},pollPeriod);
        }
        setTimeout(()=>{poll()},pollPeriod);
      });

      if(completed !== true) throw new Error("Run failed" + JSON.stringify(completed));

      let responses = await openai.beta.threads.messages.list(threadId, {limit:1});

      if(deleteThread) {
          await openai.beta.threads.del(threadId); //cleanup
          setConfig(undefined,undefined,false);
      }
      if(deleteAssistant) {
        await openai.beta.assistants.del(assistantId);
        setConfig(undefined,false);
      }

      return {text:responses.data[0].content[0].text.value, threadId};
    
  } catch (error) {
      console.error("Error in GPT request: ", error);
      throw error;
  }
}

// // Example usage
// async function main() {
//   const response = await ask({
//       model: 'gpt-4', // Model name
//       prompt: 'Hello, how are you today?', // User prompt
//       instructions: 'Write only in verse' // System message
//   });

//   console.log('Response:', response);
// }

// main();


export async function generateReadme(entryPoint, threadId) {
  try {
      console.log("Generating README.md")
      // Create a system message for generating README content
      const readmeContent = (await ask(
        {
          prompt:"Place README.md contents here. This will go on github for sharing so make it snazzy with some visual flare and emojis. Include directory of previously written markdown files. Also include a quick summary of installation and usage at the top.",
          model,
          instructions,         
          threadId,
          deleteThread:true
        }
      )).text;

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
    excluded = ['dist','node_modules']
) {
    const initialFullPaths = initialFiles.map(file => path.join(entryPoint, file));

    let threadId;

    async function readFiles(dir) {
      try {
        const files = fs.readdirSync(dir);
        let i = 0;
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
            console.log("Documenting file: ", file);
            if(i>0 && rateLimitSec > 0) {
              await new Promise((res)=>{
                console.log("Rate limit wait:", rateLimitSec); 
                setTimeout(()=>{res(true);}, rateLimitSec*1000)
              });
            }
            let documentation = await documentFile(fullPath, threadId);
            //console.log(documentation?.id);
            if(documentation) threadId = documentation.threadId;
          }
          i++;
        }
      } catch (error) {
        console.error("Error in readFiles: ", error);
      }
    }

    async function documentFile(filePath, threadId) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const documentation = (await ask({
          prompt:"Path: " + filePath + "; File Content: "+content,
          model,
          instructions,
          deleteThread:false,
          threadId
        }));

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
      let documentation = await documentFile(file);
      if(documentation) threadId = documentation.threadId;
    }

    //document all files
    await readFiles(entryPoint);
    if(rateLimitSec > 0) await new Promise((res)=>{console.log("Rate limit wait:", rateLimitSec); setTimeout(()=>{res(true);}, rateLimitSec*1000)});     
    // After documenting all files, generate README.md
    await generateReadme(entryPoint, threadId);
}

//   // Example usage
//generateDocumentation(); // You can pass parameters as needed