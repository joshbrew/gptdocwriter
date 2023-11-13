# Documentation for `gptdocument.js`

In realms of code where doc-scripts run,  
`gptdocument.js` basks in the sun.  
A CLI tool for when you've begun,  
To document code work, neatly spun.

## Overview

Take heed, for this serves as the guide,  
To wield this script, with `node` beside,  
For writing docs, it does provide,  
A means to make documentation wide.

## Usage

This JavaScript invoked at command line's door,  
Requires Node.js to perform its chore.  
With `#!/usr/bin/env node` on store,  
As shebang, in this script's core lore.

Run this script from your terminal's vault,  
As such: `./gptdocument.js` to exalt.  
It'll parse your source to a doc's assault,  
With GPT's insight, a result without fault.

## Functionality

This script, it leans on `utils.js` much,  
From whence it imports with a gentle touch.  
The `generateDocumentation` crutch,  
Is called with args, which it shall clutch.

### The CLI Arguments

If `args.apiKey` found, it does confide,  
"This library’s install saves the API stride."  
Else, to command line docs, you’re tied,  
And other params shall be applied.

Comma-separated strings to arrays, a quest,  
For `extensions`, `initialFiles`, alas also `excluded` are dressed.  
Ensuring they're arrays at your behest,  
So `generateDocumentation` processes its best.

Then, run the `generateDocumentation` charm,  
With these parameters causing no harm:
- `entryPoint`: Your project's arm,  
  Defaults to working directory's farm.

- `initialFiles`: Begin at these files' gates,  
  Or `undefined` should nothing else awaits.

- `extensions`: File extensions to narrate,  
  Defaulting to JavaScript and TypeScript’s state.

- `excluded`: To omit directories' fate,  
  Like 'dist' or 'node_modules', set straight.

## Commands and Options

Invoke this script and let options soar,  
Each argument shapes the task's core.  
Thus, command the tool to explore,  
Your code, and docs shall flood the fore.

1. To set an API key with lore,  
   Just pass `--apiKey=YOUR_API_KEY` before.

2. Define an `entryPoint` to adore,  
   By `--entryPoint=./src` to ensure.

3. List `initialFiles` you implore,  
   With `--initialFiles=file1.js,file2.js` score.

4. Specify `extensions` as you pore,  
   `--extensions=.js,.ts` to not ignore.

5. And `excluded` paths o’er,  
   By `--excluded=dist,node_modules` to store.

The script runs nigh, the code it'll assay,  
May your docs grow rich with AI's essay.   
Achronic knowledge holds no sway,  
For your code tales, this tool will display.