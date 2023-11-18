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
gptdocwriter --initialFiles utils.js,gptdocument.js

# Exclude specific files or directories from documentation
gptdocwriter --excluded server.js,node_modules,dist

# Specify file extensions to consider for documentation
gptdocwriter --extensions js,ts,tsx,jsx

# Define the model to be used - make it turbo!
gptdocwriter --model gpt-4-turbo-1106

# Clean up the assistant and thread after generating documentation. Threads are cleaned on each new run anyway.
gptdocwriter --cleanup

# Rewrite the default prompt, this repo fundamentally just reads a file then writes in a developing context, ending with a readme.  
gptdocwriter --instructions For each file, write a sonnet about it

# Some extra instructions for the AI, because it's a good listener
gptdocwriter --extraInstructions Make sure you specifically list the input arguments for the cli

# Tells the readme what the project name is
gptdocwriter --name gptdocwriter

# Instead of writing md files, let's transpose to python with a custom prompt!
gptdocwriter --outputFormat .py  

# We can replace the readme prompt with whatever as well, as it just uses a fill-in-the-blanks template.
gptdocwriter --readme Summarize what you read into a 3 paragraph report on donkey genetics.


*/