# `utils.js` Module Documentation

The `utils.js` file is a core part of the GPT documentation system. It contains functions and utilities for interacting with the command line, managing configuration, and interfacing with the OpenAI API to generate documentation.

## Table of Contents

- [Installation](#installation)
- [Utilities Overview](#utilities-overview)
- [Command Line Arguments](#command-line-arguments)
- [Configuration Management](#configuration-management)
- [OpenAI Interaction](#openai-interaction)
- [Document Generation](#document-generation)

## Installation

Before using this module, ensure that you have Node.js installed. You will also need access to the OpenAI API, which requires an API key. Once you have the prerequisites, you can import this module into your Node.js application as shown below:

```javascript
import { getArgs, setConfig, getConfig, ask, generateReadme, generateDocumentation } from './utils.js';
```

## Utilities Overview

This module exports the following utilities:

- `getArgs`: Parses command-line arguments.
- `args`: Contains the parsed command line arguments.
- `setConfig`: Saves the API key and Assistant ID to a configuration file.
- `getConfig`: Retrieves the API key and Assistant ID from the configuration file.
- `ask`: Interacts with the OpenAI model using a prompt.
- `generateReadme`: Generates a `README.md` file based on a prompt.
- `generateDocumentation`: Generates documentation for JavaScript source code files.

## Command Line Arguments

### `getArgs`

The `getArgs` function accepts an array of command line arguments and returns an object mapping the arguments to values. Arguments can be in the form `"--key value"` or `"key=value"`.

```javascript
export const args = getArgs(process.argv);
```

## Configuration Management

### `setConfig`

Saves API key, Assistant ID, and a thread ID to a `config.txt` file. If the file already exists, it will update the existing configuration.

```javascript
setConfig(apiKey, assistantId, threadId);
```

### `getConfig`

Retrieves the API key, Assistant ID, and thread ID from the `config.txt` file. If the file does not exist, it will return an empty object.

```javascript
const { API_KEY, ASSISTANT_ID, THREAD_ID } = getConfig();
```

## OpenAI Interaction

### `ask`

Interacts with an OpenAI model using a prompt and optional instructions. It supports continuous message threads with the model and can be configured to either retain or delete these threads after interaction.

```javascript
const response = await ask({
  model: 'gpt-4', // Model name
  prompt: 'Hello, how are you today?', // User prompt
  instructions: 'Write only in verse', // System message
  threadId: 'example-thread-id',
  deleteThread: true,
  deleteAssistant: false
});
```

## Document Generation

### `generateReadme`

Generates a `README.md` file given an entry point directory and a thread ID. It includes the directory of previously written markdown files and a summary of installation and usage.

```javascript
await generateReadme(entryPoint, threadId);
```

### `generateDocumentation`

Generates documentation for an array of initial files, with specified file extensions and excluding certain directories.

```javascript
await generateDocumentation(entryPoint, initialFiles, fileExtensions, excluded);
```

## Example Usage

Below is commented out code that provides an example of how to use these utilities:

```javascript
// (Uncomment this code for actual use)
// async function main() {
//   const response = await ask({
//       model: 'gpt-4', // Model name
//       prompt: 'Hello, how are you today?', // User prompt
//       instructions: 'Write only in verse' // System message
//   });
//
//   console.log('Response:', response);
// }
//
// main();
```

## Additional Notes

- The `ask` function uses a mechanism for streaming data with an optional callback for progress updating.
- The interaction with OpenAI's GPT models is rate-limited based on the model chosen.
- The `generateDocumentation` function can be invoked to document an entire project directory recursively.

**Remember to set your API key before using any function that interacts with the OpenAI API**.

```javascript
let apiKey = "your-api-key-here"; // Set your OpenAI API Key
``` 

With this in place, you'll be able to generate comprehensive markdown documentation for your codebase, leveraging the impressive language capabilities of OpenAI's models.