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


//possible command line commands w/ example input:
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
