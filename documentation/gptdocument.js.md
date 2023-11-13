# `gptdocument.js` Script Documentation

The `gptdocument.js` file is a command-line interface (CLI) script for the GPT documentation system. It primarily utilizes the `generateDocumentation` function provided by the `utils.js` utility module to initiate the documentation process for source code files.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Arguments Processing](#arguments-processing)
- [Invocation](#invocation)

## Installation

Before using this script, please ensure you have installed Node.js as well as the dependencies (e.g., OpenAI SDK) required by the `utils.js` module. This script should be included within the same project that contains the `utils.js` module.

## Usage

This script can be executed directly from the command line with appropriate arguments. No manual invocation from within a file is necessary since the script includes the shellbang (`#!/usr/bin/env node`) at the top, which tells the environment to execute this file with Node.js.

## Arguments Processing

### API Key

If the `apiKey` argument is provided, it logs that the API key is being set, which includes saving to the installed library location:

```shell
node gptdocument.js --apiKey YOUR_API_KEY
```

### Extensions

The `extensions` argument defines which file extensions should be documented. It gets converted to an array if it’s not already one.

### Initial Files

The `initialFiles` argument specifies the initial set of files to include for documentation. It's also converted to an array if necessary.

### Excluded Directories

The `excluded` argument defines directories to exclude from the documentation process, such as `dist` and `node_modules`.

## Invocation

After processing the command-line arguments, the script calls the `generateDocumentation` function with the processed arguments. When no arguments are provided, defaults are used.

```shell
node gptdocument.js
```

### Example Invocation with Arguments

```shell
node gptdocument.js --entryPoint ./src --initialFiles index.js,app.js --extensions .js,.jsx --excluded dist,node_modules
```

This would initiate documentation generation starting from the `./src` directory, document the `index.js` and `app.js` files first, include files with `.js` and `.jsx` extensions, and exclude any files within the `dist` and `node_modules` directories.

**Note**: If you need to pass an argument that includes a comma-separated list, make sure to not include spaces after the commas for this script to parse them correctly.

## Additional Notes

This CLI script is meant for ease of use so that a developer can quickly and efficiently generate markdown documentation for a given set of source code by simply providing command-line arguments tailored to their specific project's organizational structure and file types.