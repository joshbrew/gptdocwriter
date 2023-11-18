# Documentation Generation Tool with GPT 4 Turbo!

This uses the beta thread and assistant features of the official [openai node API](https://github.com/openai/openai-node). See [Reference](https://platform.openai.com/docs/api-reference/assistants)

For global usage:
`npm i -g gptdocwriter`

Then, from your desired folder:
`gptdocwriter --initialFiles index.js,utils.js --extensions .js,.jsx --excluded dist,node_modules --model gpt-4-1106-preview`

entryPoint defaults to current working directory

## Features

- Set an API key for authenticating with the OpenAI API.
- Generate documentation based on specified entry points, file types, and other criteria.
- Exclude certain files or directories from being documented.
- Define custom models, output formats, and additional instructions for the AI to follow.

## Usage

The various command line arguments include. Combine as needed. Call --apiKey first.

```bash
# Set the API key for OpenAI services
gptdocwriter --apiKey sk-abcdefg

# Generate documentation for specific files and crawl others
gptdocwriter --initialFiles utils.js,gptdocument.js

# Exclude files or directories from being documented
gptdocwriter --excluded server.js,node_modules,dist

# Specify which file extensions to include in the documentation
gptdocwriter --extensions js,ts,tsx,jsx

# Choose the GPT-4 model variant to use
gptdocwriter --model gpt-4-turbo-1106

# Tidy up after generating documentation
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
```

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

# GPTDocWriter :bookmark_tabs: :sparkles:

Embrace the muse of documentation, where prose is paired with code,
A repository enriched with AI, a doc-gen tool abode.
GPTDocWriter wields the pen of GPT-4's might,
To craft the docs that shadow software, bringing its logic to light.

---

## Quick Start :rocket:

### Installation :wrench:

```bash
npm install -g gptdocwriter
```

Configure your API key to unlock the AI's insights:

```bash
gptdocwriter --apiKey your-openai-key
```

### Usage :computer:

Generate documentation effortlessly with a simple command:

```bash
gptdocwriter --initialFiles yourEntryPoint.js
```

Voila! Documentation emerges, like sunlight through the dawn.

---

## Documentation Directory :file_folder:

- [`utils.js`](./documentation/utils.js.md)
- [`gptdocument.js`](./documentation/gptdocument.js.md)

---

## Features :star2:

- **AI-Powered Documentation**: Utilize the latest GPT-4 model to generate in-depth documentation for your codebase.
- **Customizable**: Tailor the documentation process with a myriad of command-line arguments.
- **Extensible**: Supports various file extensions by default and allows for custom ones as needed.
- **Clean-Up Mechanism**: Maintain a neat workspace by cleaning up threads post-documentation generation.

## Use Cases :bulb:

- **Large Codebases**: Navigating vast seas of code? Let the AI assistant chart the documentation course.
- **API Documentation**: Have APIs that need documenting? This tool will create coherent and comprehensive guides.
- **Education and Learning**: Study how documentation is crafted by examining AI-generated examples.
- **Continuous Integration**: Integrate into your CI pipeline for up-to-date documentation at all times.

## Contributing :handshake:

Your insights and code are the winds that propel this project forward. If you're looking to contribute, simply:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License :page_with_curl:

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements :clap:

- [OpenAI](https://openai.com/) for their AI models.
- All the contributors who pour their time into open source.

---

Embrace the future of documentation with GPTDocWriter, where clarity and precision meet AI's fertile mind. 📜✨
