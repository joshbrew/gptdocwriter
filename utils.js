import fs from 'fs'
import path from 'path'
import * as url from 'url';
import { getArgs, colorText } from './console.js';

import OpenAI from 'openai';

let apiKey = ""; //set this if not using CLI

//possible command w/ example input for this repo:
/**
Set this first:
gptdocwriter --apiKey sk-abcdefg
  
Combine the following arguments as you wish.
Then run gptdocwriter or node gptdocument.js with any of these settings:

#defaults to current working directory
gptdocwriter --entryPoint path/to/src

# Set the API key for OpenAI services
gptdocwriter --apiKey sk-abcdefg

# Generate documentation for specific files before crawling extensions in the order they appear
gptdocwriter --initialFiles utils.js,gptdocument.js

# Exclude files or directories from being documented
gptdocwriter --excluded server.js,node_modules,dist

# Specify which file extensions to include in the documentation
gptdocwriter --extensions js,ts,tsx,jsx

# Choose the GPT-4 model variant to use
gptdocwriter --model gpt-4-turbo-1106

# Clear current assistant before/after generating documentation (will be cleared if instructions are updated)
gptdocwriter --cleanup

# Restart the thread at the last file read. Do this after a crash if you want to recover your position in the last thread, else it will be deleted on next call
gptdocwriter --continue

# Tailor the prompt for the AI instead of the default prompt
gptdocwriter --instructions Write detailed documentation about each file

# Include additional specific instructions
gptdocwriter --extraInstructions Mention the CLI input arguments

# Specify the project name within the readme
gptdocwriter --name gptdocwriter

# Change the output format to another extension than .md, e.g. we could transpose files from one programming language to another
gptdocwriter --outputFormat .py

# Adjust the readme content template
gptdocwriter --readme Summarize this in a digestible format for folks who got a D in English

# Rate Limit requests (default 12.5sec for GPT 4 preview, change as necessary, we'll adapt too as rate limits are uncapped)
gptdocwriter --rateLimit 20

# Don't clear the thread at the end (default else it would keep context on the next folder)
gptdocwriter --keepThread

*/

// Parse CLI arguments, import to main script
export const args = getArgs();


let instr = `You are a senior developer/engineer receiving source code from applications or libraries, starting with the most critical files in order to recursively document source code for comprehensive developer documentation. 

Your documentation should build upon each file's context as you are fed them in the thread, with cohesive, well-articulated, professional writing. 

Make it clear for readers how to use the code.

Responses will be parsed as if they are ${args.outputFormat ? args.outputFormat : '.md'} files, for each file you are given, and written to file paths like ./documentation/relpath/filename.ext.${args.outputFormat ? args.outputFormat : '.md'}, mirroring the repository structure, and should look like any other detailed, easily readable markdown (or otherwise specified) documentation on github (e.g. the first line should only be a hashtag title).

`;

if(args.instructions) {
  instr = args.instructions;
}

if(args.extraInstructions) {
  instr += "Also, strictly follow these extra instructions: " + args.extraInstructions;
  console.log("Modified instructions with:", args.extraInstructions);
} else instr += "Also, strictly follow these extra instructions: " + `Occasionally write random bits of sardonic/self-deprecating humor without being cringe.`; //dummy extra instructions


//define --model gpt-4 etc. Note: not free
const model = args.model ? args.model : 'gpt-4-1106-preview';//'gpt-4';//8k //'gpt-3.5-turbo-1106' //16k //'gpt-4-1106-preview'; //128k

if(args.extraInstructions || args.instructions || args.outputFormat || args.model) {
  args.cleanup = true; //need to replace the dedicated assistant if modifying instructions
}


const CONFIG_FILE = path.join(url.fileURLToPath(new URL('.', import.meta.url)), 'config.txt');

// Function to set the API key and Assistant ID and save them to a file
export function setConfig(apiKey, assistantId, threadId, lastFile) {
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
  if (typeof lastFile !== 'undefined') {
    if(threadId === false) delete existingConfig['LAST_FILE'];
    else existingConfig['LAST_FILE'] = lastFile;
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
const { API_KEY, ASSISTANT_ID, THREAD_ID, LAST_FILE } = getConfig();


// Set API key if provided
if (args.apiKey) {
  apiKey = args.apiKey;
  setConfig(apiKey);
} else if(!apiKey) apiKey = API_KEY;

console.log(
  colorText("Running GPT Doc generator with model", "green"), 
  colorText(model, "yellow")
);

let rateLimitSec = model === 'gpt-4-1106-preview' ? 12.5 : 0; //basically we need to limit to 10000 TPM so around 4 files per minute.

if(args.rateLimit) rateLimitSec = parseFloat(args.rateLimit);

if(rateLimitSec > 0) console.log(
  colorText("Note: GPT-4 preview rate limited for token limits: "+ rateLimitSec + " sec between requests","yellow")
);

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
      console.log("Clearing previous assistant");
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
  instructions=instr,
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
              console.log(colorText("Run failed, retrying","red"), run);
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

      if(deleteThread && !args.keepThread) {
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


export async function generateReadme(entryPoint, threadId, instructions=instr, outputFormat=args?.outputFormat ? args.outputFormat : '.md',) {
  try {
      console.log(colorText("Generating README.md","blue"));
      // Create a system message for generating README content
      let readmeContent = (await ask(
        {
          prompt:args.readme ? args.readme : `Place README.md contents here for this repository${args.name ? `, named: ${args.name}` : ``}. This will go on github for sharing so make it snazzy with some visual flare and emojis. Include directory of previously written markdown files. Also include a quick summary of installation and usage at the top. List possible use cases. Otherwise follow your instructions.`,
          model,
          instructions,         
          threadId,
          deleteThread:args.keepThread ? false : true,
          deleteAssistant:args.cleanup //reuse assistant if not specified
        }
      )).text;

      // Define path for README.md
      let readmePath = path.join(entryPoint, 'documentation', 'README'+(outputFormat));

      if(readmeContent.startsWith('```')) { //parse off any excess markdown brackets
        if(readmeContent.startsWith('```markdown')) {
          readmeContent = readmeContent.substring(11,readmeContent.length-4);
        } else 
          readmeContent = readmeContent.substring(3,readmeContent.length-4);
      }
      // Write the README file
      fs.writeFileSync(readmePath, readmeContent);
      console.log(colorText("README.md generated at: ","magenta"), readmePath);
  } catch (error) {
      console.error("Error in generateReadme: ", error);
  }
}


export async function generateDocumentation(
    entryPoint = process.cwd(), 
    initialFiles = [], 
    fileExtensions = ['.js', '.ts', '.mjs', '.jsx', '.tsx'], 
    excluded = ['dist','node_modules'],
    instructions=instr,
    outputFormat=args?.outputFormat ? args.outputFormat : '.md',
) {
    const initialFullPaths = initialFiles.map(file => path.join(entryPoint, file));

    if(args.cleanup && !cleanedUp) {
      await cleanup();
    } else if(lastThreadId && !args.continue) { //clear previous thread
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
        let cont = true; 
        for (let file of files) {
          if(args.continue && LAST_FILE && cont) {
            if(file === LAST_FILE) {
              cont = false; setConfig(undefined,undefined,undefined,false);
            } else continue;
          }
          setConfig(undefined,undefined,undefined,file); //last file read in case of crash
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
            console.log(colorText("Documenting file: ", "blue"), file);
            if(i>0 && rateLimitSec > 0) {
              await new Promise((res)=>{
                //console.log("Rate limit wait:", rateLimitSec); 
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
        console.error(colorText("Error in documentFile: ", "red"), error);
      }
    }

    function writeDocumentation(originalFilePath, documentation) {
      try {
        const relativePath = path.relative(entryPoint, originalFilePath);
        const docFilePath = path.join(entryPoint, 'documentation', `${relativePath}${outputFormat}`);

        const docDir = path.dirname(docFilePath);
        if (!fs.existsSync(docDir)) {
          fs.mkdirSync(docDir, { recursive: true });
        }

        fs.writeFileSync(docFilePath, documentation);

        let getRandomIdx = (arr=[]) => {
          let arrIdx = Math.floor(Math.random() * arr.length);
          return arr[arrIdx];
        }
        let randomQuote = getRandomIdx([
          "Gold needed.",
          'I feel dizzy!',
          "Our food stocks are dwindling, my liege.",
          "This building has no labor, sire.",
          "We are losing a bit of money, my liege.",
          "You can count on us! What're we doing?"
        ]);
        console.log(colorText('Documented to:','magenta'),`${docFilePath},`, colorText(randomQuote, "cyan"));
      } catch (error) {
        console.error(colorText("Error in writeDocumentation: ", "red"), error);
      }
    }

    for (let file of initialFullPaths) {
      console.log(colorText("Documenting file: ","blue"), file);
      let documentation = await documentFile(file);
      if(documentation) threadId = documentation.threadId;
    }

    //document all files
    await readFiles(entryPoint);
    if(rateLimitSec > 0) await new Promise((res)=>{
      //console.log("Rate limit wait:", rateLimitSec); 
      setTimeout(()=>{res(true);}, rateLimitSec*1000)
    });     
    // After documenting all files, generate README.md
    await generateReadme(entryPoint, threadId, instructions, outputFormat);
    console.log(colorText("...Work halted, mi'lord.","cyan"));
}

// Example usage
//generateDocumentation(); // You can pass parameters as needed