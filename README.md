# Documentation Generation Tool with GPT 4 Turbo!

This uses the beta thread and assistant features of the official [openai node API](https://github.com/openai/openai-node). See [Reference](https://platform.openai.com/docs/api-reference/assistants)

For global usage:
`npm i -g gptdocwriter`

Then, from your desired folder:
`gptdocwriter --entryPoint path/to/src --initialFiles index.js,utils.js --extensions .js,.jsx --excluded dist,node_modules --model gpt-4-1106-preview`

entryPoint defaults to current working directory

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

(GPT generated docs after this)
# GPT Doc Generator: A README

Welcome to the GPT Doc Generator, the documentation generation tool that automates your source code documentation using the power of OpenAI's GPT models. 

## Quick Start

### Installation

You'll need Node.js to use the GPT Doc Generator. To get started, clone the repository and navigate to the project's root directory:

```sh
git clone https://github.com/your-username/gpt4-documenter.git
cd gpt4-documenter
```

Install all the required dependencies:

```sh
npm install
```

### Usage

Run the `gptdocument.js` script with Node to generate documentation. You can provide arguments to specify entry points, file patterns, and exclusions:

```sh
node gptdocument.js --entryPoint ./src --extensions .js,.jsx --excluded dist,node_modules --model gpt-3.5-turbo-1106
```

Ensure your API key for OpenAI is set correctly in `utils.js` or passed in through the command line for the script to function.

## Documentation Directory

All generated documentation can be found in the `documentation` folder, structured to mirror the source code's hierarchy. Each file you run through our system will receive its markdown file, detailing its functionality and usage.

Here's the structure of the `documentation` directory after running the script:

```
/documentation
│── README.md
│
├── utils.md              # Documentation for the overall utility functions
├── gptdocument.md        # Documentation for the GPT documenter script
│
└── /src                  # Mirrored structure of your /src directory
   ├── index.md           # Documentation for index.js
   ├── app.md             # Documentation for app.js
   └── /components
       ├── header.md      # Documentation for Header Component
       └── footer.md      # Documentation for Footer Component
```

## Contributing

Feel free to fork this project, submit pull requests, or report bugs and issues on the [issue tracker](https://github.com/your-username/gpt4-documenter/issues).

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

This project harnesses the awesome power of OpenAI's GPT models to interpret and document the codebase in a human-readable format, saving countless hours and ensuring quality across your project's documentation.

---

Snazz up your project with GPT Doc Generator and say goodbye to manual documentation!