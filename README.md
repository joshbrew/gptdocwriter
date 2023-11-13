# Documentation Generation Tool with GPT 4 Turbo!

This uses the beta thread and assistant features of the official [openai node API](https://github.com/openai/openai-node). See [Reference](https://platform.openai.com/docs/api-reference/assistants)

For global usage:
`npm i -g gptdocwriter`

Then, from your desired folder:
`gptdocwriter --initialFiles index.js,utils.js --extensions .js,.jsx --excluded dist,node_modules --model gpt-4-1106-preview`

entryPoint defaults to current working directory

The various command line arguments include:

- `--apiKey`: Your OpenAI API key (e.g. `sk-abcdefg`). Treat this like your diary—personal and private.
- `--initialFiles`: Comma-separated list of startup files (e.g. `utils.js,gptdocument.js`).
- `--excluded`: Comma-separated list of paths to be excluded from documentation (e.g. `server.js,node_modules,dist`).
- `--extensions`: Comma-separated list of file extensions to include in the documentation (e.g. `js,ts,tsx,jsx`).
- `--model`: The model of GPT to use (e.g. `gpt-4-turbo-1106`).
- `--cleanup`: Boolean flag to clean up anything afterward. Probably leftover "documentation" pizza boxes.
- `--extraInstructions`: Additional instructions for usage clarification (e.g. "Make sure you specifically list the input arguments for the cli").
- `--name`: Name of the project to document (e.g. `gptdocwriter`).


inputs listed are defaults.

Set API Key (saved to the library folder (keep private!!) in config.txt)

`gptdocwriter --apiKey sk-abcdefg`

Or set in utils.js and execute this locally via `node gptdocument.js xxx`

Or module usage:
```js 

import {generateDocumentation} from 'gptdocwriter'

// CLI usage to call generateDocumentation
generateDocumentation(
    process.cwd(), 
    ['utils.js'],  //scan the rest of the files after this specified order is completed
    ['.js', '.ts', '.mjs', '.jsx', '.tsx'], 
    ['dist','node_modules']
);

```

The prompt for all of this is experimental so tweak it as you need.

See a repo where I applied this to a fairly hefty codebase: [JS Maze Generator with A* solver](https://github.com/joshbrew/JS-Maze-Generator-with-A-Star-Solver/tree/main/documentation)

GPT generated docs below, with extra instructions to use strict iambic pentameter:

- Generated with: `node gptdocument.js --excluded server.js,node_modules,dist --initialFiles utils.js,package.json --cleanup --extraInstructions Write everything in iambic pentameter without exception.`

# GPT Doc Writer 📄✨

Elevate your code with prose well-brewed,
For documentation's never skewed.
With AI's touch, the task pursued,
GPT 4 ensures it's aptly viewed.

## Quick Start 🚀

### Installation

```bash
npm install gptdocwriter
```

### Usage

To generate your API documentation:

```bash
./gptdocument.js --apiKey YOUR_API_KEY
```

Use different options to tweak the generation:

```bash
./gptdocument.js --entryPoint ./src --initialFiles index.js --extensions .js,.ts --excluded dist,node_modules
```

## Directory 📁

- [`gptdocument.js`](.\gptdocument.js) - The core script to generate docs.

## Features and Use Cases 🔍

- **API Documentation**: For your library or application, generate human-like documentation.

- **Developer Onboarding**: Ease new developers into your project with comprehensive docs.

- **Code Review**: Enhance code understanding with descriptive docs for reviewers.

- **Continuous Documentation**: Integrate with your CI/CD pipeline for updated docs each push.

## Why GPT Doc Writer? 🤔

With the might of GPT 4 employed,
The chore of docs is thus destroyed.
Your codebase grand and unalloyed,
By clear docs that shall fill the void.

Adorned with knowledge fresh and keen,
Your source reflects what's oft unseen.
Each function, class, and routine clean,
Documented, like a well-oiled machine.

## Contributing

Join our quest, oh knights of code! 🛠️
For contributions do indeed bode
A better tool, a brighter abode,
Raise an issue, fork and upload.

## License

Distributed under the MIT License. See `LICENSE` file for more information.

---

Craft your docs with AI's guide,  
Your path to clarity, far and wide.  
For with GPT Doc Writer by your side,  
In doc excellence, you shall abide. ✨