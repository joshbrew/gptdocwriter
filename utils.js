import fs from 'fs'
import path from 'path'
import * as url from 'url';

import OpenAI from 'openai';

let apiKey = ""; //use this if not using CLI

let instructions = `You are receiving source code from applications or libraries, starting with the most critical files in order to recursively document source code for comprehensive developer documentation. 

Your documentation should build upon each file's context as you are fed them in the conversation, forming cohesive, well-articulated, professional Markdown documents. Your responses will be parsed as if they were the body of markdown files for each file you are given. 

Make it clear how to use the code.

Assume your responses will sit in a documentation folder on the repository, mirroring the repository structure, and should look like any other detailed, easily readable markdown documentation.
`;

//get command line args either "--key value" or "key=value"
export const getArgs = (args = process.argv) => {
  const argMap = {};
  let currentKey = null;

  for (let i = 0; i < args.length; i++) {
    const v = args[i];
    if (v.startsWith('--')) {
      if (currentKey !== null) {
        // Check if currentKey's value is comma-separated and convert to an array if so
        argMap[currentKey] = argMap[currentKey].includes(',') ? argMap[currentKey].split(',').map(item => item.trim()) : argMap[currentKey].trim();
        if(argMap[currentKey] == '') argMap[currentKey] = true;
      }
      currentKey = v.replace(/^-+/g, '').trim(); // Remove all leading dashes
      argMap[currentKey] = '';
    } else if (v.includes('=')) {
      const split = v.split('=');
      const key = split[0].replace(/^-+/g, '').trim(); // Remove leading dashes from key
      const value = split[1];
      argMap[key] = value.includes(',') ? value.split(',').map(item => item.trim()) : value;
      currentKey = null;
    } else {
      if (currentKey !== null) {
        argMap[currentKey] += ' ' + v;
      } else {
        argMap[v] = true;
      }
    }
  }

  if (currentKey !== null) {
    // Check if currentKey's value is comma-separated and convert to an array if so
    argMap[currentKey] = argMap[currentKey].includes(',') ? argMap[currentKey].split(',').map(item => item.trim()) : argMap[currentKey].trim();
  }

  return argMap;
};

// Parse CLI arguments
export const args = getArgs();

if(args.extraInstructions) {
  instructions += args.extraInstructions;
  console.log("Modified instructions with:", args.extraInstructions);
} else instructions += `Occasionally write random bits of sardonic/self-deprecating humor.`; //dummy extra instructions


//possible command w/ example input for this repo:
/**
 * Set this first:
 * --apiKey sk-abcdefg
 * 
 * Then run gptdocwriter or node gptdocument.js with any of these settings:
 * --initialFiles utils.js,gptdocument.js
 * --excluded server.js,node_modules,dist
 * --extensions js,ts,tsx,jsx
 * --model gpt-4-turbo-1106
 * --cleanup
 * --extraInstructions Make sure you specifically list the input arguments for the cli
 * --name gptdocwriter
 */



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
              existingConfig[key.trim()] = value ? value.trim() : '';
          }
      });
      fs.rmSync(CONFIG_FILE);
  }

  // Update the existing config with new values if provided, or remove them if false
  if (typeof apiKey !== 'undefined') {
    if(apiKey === false) delete existingConfig['API_KEY'];
    else existingConfig['API_KEY'] = apiKey;
  }
  if (typeof assistantId !== 'undefined') {
    if(assistantId === false) delete existingConfig['ASSISTANT_ID'];
    else existingConfig['ASSISTANT_ID'] = assistantId;
  }
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

let cleanedUp=false;

async function cleanup() {  
    // Standard response
    if(lastThreadId) {
      await openai.beta.threads.del(lastThreadId); //makes sure aborted threads are cleared
      setConfig(undefined,undefined,false); 
      lastThreadId = undefined;
    }
    //Create an assistant and thread to interact with GPT models

    if(assistantId) {

      console.log("clearing previous assistant");

      await openai.beta.assistants.del(assistantId);
      assistantId = undefined;
      setConfig(undefined,false);
    }

  cleanedUp = true;

  return true;
}

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


export async function generateReadme(entryPoint, threadId, instructions) {
  try {
      console.log("Generating README.md")
      // Create a system message for generating README content
      const readmeContent = (await ask(
        {
          prompt:`Place README.md contents here for this repository${args.name ? `, named: ${args.name}` : ``}. This will go on github for sharing so make it snazzy with some visual flare and emojis. Include directory of previously written markdown files. Also include a quick summary of installation and usage at the top. List possible use cases near the bottom along with other typical readme stuff.`,
          model,
          instructions,         
          threadId,
          deleteThread:true,
          deleteAssistant:args.cleanup //reuse assistant if not specified
        }
      )).text;

      // Define path for README.md
      const readmePath = path.join(entryPoint, 'documentation', 'README.md');

      if(readmeContent.startsWith('```')) { //parse off any excess markdown brackets
        if(readmeContent.startsWith('```markdown')) {
          readmeContent = readmeContent.substring(11,readmeContent.length-3);
        } else 
          readmeContent = readmeContent.substring(3,readmeContent.length-3);
      }
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
    extraInstructions = ""
) {
    const initialFullPaths = initialFiles.map(file => path.join(entryPoint, file));

    if(extraInstructions) {
      instructions += extraInstructions;
      //instructions modified, cleanup
      await cleanup(); 
      if(args.cleanup) delete args.cleanup; //already called so delete
    } else if(args.cleanup && !cleanedUp) {
      await cleanup();
    } else if(lastThreadId) { //clear previous thread
      await openai.beta.threads.del(lastThreadId); //makes sure aborted threads are cleared
      setConfig(undefined,undefined,false); lastThreadId = undefined;
    }

    let threadId;
    //check the assistant exists
    let assistants = await openai.beta.assistants.list({});
    if(assistantId && !assistants?.data?.find((a) => {
      if(a.name === "The god of docs.") {
        assistantId = a.id;
        return true;
      }
    })) {
      setConfig(undefined,false);
      assistantId = undefined;
    }

    async function readFiles(dir) {
      try {
        const files = fs.readdirSync(dir);
        let i = 0;
        for (let file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);

          if (excluded.some(excludedDir => fullPath.includes(excludedDir)) ||
              initialFullPaths.includes(fullPath)
            ) {
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
        let relPath = path.relative(entryPoint,filePath);
        const documentation = (await ask({
          prompt:"Path: " + (relPath ? relPath : filePath) + "; File Content: "+content,
          model,
          instructions,
          deleteThread:false,
          threadId
        }));

        if(documentation.text.startsWith('```')) { //parse off any excess markdown brackets
          if(documentation.text.startsWith('```markdown')) {
            documentation.text = documentation.text.substring(11,documentation.text.length-3);
          } else 
            documentation.text = documentation.text.substring(3,documentation.text.length-3);
        }

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

        let getRandomIdx = (arr=[]) => {
          let arrIdx = Math.floor(Math.random() * arr.length);
          return arr[arrIdx]
        }
        let randomQuote = getRandomIdx([
          "Gold needed.",
          'I feel dizzy!',
          "Our food stocks are dwindling, my liege.",
          "This building has no labor, sire.",
          "We are losing a bit of money, my liege.",
          "You can count on us! What're we doing?"

        ]);
        console.log(`Documented to:  ${docFilePath},`, randomQuote);
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
    console.log( "...Work halted, mi'lord.");
}

// Example usage
//generateDocumentation(); // You can pass parameters as needed