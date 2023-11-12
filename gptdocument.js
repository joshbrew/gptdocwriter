#!/usr/bin/env node

import {generateDocumentation, args} from './utils.js'

// Convert comma-separated string to array
const toArray = (str) => str ? str.split(',').map(item => item.trim()) : [];

// CLI usage to call generateDocumentation
generateDocumentation(
    args.entryPoint ? args.entryPoint : process.cwd(), 
    args.initialFiles ? toArray(args.initialFiles) : undefined, 
    args.extensions ? toArray(args.extensions) : ['.js', '.ts', '.mjs', '.jsx', '.tsx'], 
    args.excluded ? toArray(args.excluded) : ['dist','node_modules'],
    null// onProgress=(partialResponse, lastLength) => {
    //     console.log(partialResponse.text.substring(lastLength));
    //     curLength = partialResponse.text.length;
    // },
);