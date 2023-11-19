#!/usr/bin/env node

import {generateDocumentation, args} from './utils.js'

// Convert comma-separated string to array
if(args.apiKey) {
    console.log("Setting api key (saved to this library's install location)");
} else {
    // CLI usage to call generateDocumentation
    if(args.extensions && !Array.isArray(args.extensions)) args.extensions = [args.extensions];
    if(args.initialFiles && !Array.isArray(args.initialFiles)) args.initialFiles = [args.initialFiles];
    if(args.excluded && !Array.isArray(args.excluded)) args.excluded = [args.excluded];

    generateDocumentation(
        args.entryPoint ? args.entryPoint : process.cwd(), 
        args.initialFiles ? args.initialFiles : undefined, 
        args.extensions ? args.extensions : ['.js', '.ts', '.mjs', '.jsx', '.tsx'], 
        args.excluded ? args.excluded : ['dist','node_modules']
    );
}

//possible command w/ example input for this repo:
/**
Set this first:
gptdocwriter --apiKey sk-abcdefg
  
Combine the following arguments as you wish.
Then run gptdocwriter or node gptdocument.js with any of these settings:
# Generate documentation for specific initial files, then crawl the rest of the specified extensions (defaults to js)

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