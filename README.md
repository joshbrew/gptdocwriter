# Documentation Generation Tool with ChatGPT 4 Turbo (128K context!)

For global usage:
`npm i -g gptdocument`

Then, from your desired folder:
`gptdocument --entryPoint=path/to/src --initialFiles=index.js,utils.js --extensions=.js,.jsx --excluded=dist,node_modules`

entryPoint defaults to process.cwd()

inputs listed are defaults.

Set API Key

`gptdocument --apiKey sk-abcdefg`

Or set in utils.js and execute this locally via `node gptdocument.js xxx`

Or module usage:
```js 

import {generateDocumentation} from 'gptdocument'

// CLI usage to call generateDocumentation
generateDocumentation(
    process.cwd(), 
    ['index.js'],  //scan the rest of the files after this specified order is completed
    ['.js', '.ts', '.mjs', '.jsx', '.tsx'], 
    ['dist','node_modules'],
    null//  onProgress=(partialResponse, lastLength) => {
   //      console.log(partialResponse.text.substring(lastLength));
   //      curLength = partialResponse.text.length;
   //  },
);

```

The prompt for all of this is experimental so tweak it as you need.

I've pumped as much as 110kb of code from a single file into GPT 4 turbo.

(GPT generated docs after this)

## Project Title

Documentation Generation Tool with ChatGPT

## Description

This project is a command-line tool designed to automatically generate documentation for source code files. It utilizes OpenAI's ChatGPT model to assist in creating comprehensive and human-readable markdown documents for each file within a project.

## Features

- Generates documentation based on the source code provided.
- Supports customizable entry points, file extensions, and exclusion lists through CLI arguments.
- Integrates with ChatGPT API to enhance documentation quality and coherence.

## Getting Started

### Prerequisites

- Node.js installed
- An OpenAI API key, set via `--apiKey` or within `utils.js` by hardcoding the apiKey variable.

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/joshbrew/gpt4-documenter.git
   ```
   
2. Navigate to the project directory:
   ```sh
   cd gpt4-documenter
   ```

3. Install the dependencies:
   ```sh
   npm install
   ```

### Usage

To start generating documentation, use the following command pattern:

```sh
node gptdocument.js [options]
```

Where `[options]` can include:

- `--entryPoint`: The directory path where the documentation generation should begin.
- `--initialFiles`: A comma-separated list of initial files to document first.
- `--extensions`: A comma-separated list of file extensions to include in documentation.
- `--excluded`: A comma-separated list of directories to exclude from documentation.

Example usage:

```sh
node gptdocument.js --entryPoint=./src --initialFiles=index.js,utils.js --extensions=.js,.jsx --excluded=dist,node_modules
```

This will generate documentation for `.js` and `.jsx` files under the `./src` directory, prioritizing `index.js` and `utils.js`, while excluding any files in the `dist` and `node_modules` directories.

## Contributing

Contributions are welcome! If you have suggestions for improving the tool, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

---

**Note**: Always ensure that the API key is secured and not exposed to public repositories. For detailed instructions on setting up the API key, refer to the `utils.js` documentation.
