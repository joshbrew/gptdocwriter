# Documentation for `utils.js`

The `utils.js` file is an essential part of an application that integrates with OpenAI's GPT models to generate documentation automatically. It primarily handles command-line argument parsing, configuration management, OpenAI API communication, and driving the documentation generation process.

Below we detail the functionality provided by this file and instructions on how to engage with the code.

---

## Table of Contents

1. [Importing Dependencies](#importing-dependencies)
2. [Command-Line Argument Parsing](#command-line-argument-parsing)
3. [Argument Parsing Function](#argument-parsing-function)
4. [API Key and Instruction Management](#api-key-and-instruction-management)
5. [Configuration Management](#configuration-management)
6. [OpenAI API Interaction](#openai-api-interaction)
7. [Documentation Generation Functions](#documentation-generation-functions)
8. [Usage Example](#usage-example)

---

## Importing Dependencies

```javascript
import fs from 'fs';
import path from 'path';
import * as url from 'url';
import OpenAI from 'openai';
```

The `utils.js` file requires several Node.js modules to handle file system operations, path normalization, URL processing, and interactivity with OpenAI's GPT models.

## Command-Line Argument Parsing

The file includes parsing of command-line arguments to adjust the behavior of the utility. Arguments can be in two forms: `--key value` or `key=value`. If you are not a fan of command-line arguments, you're welcome to hardcode everything and live dangerously!

## Argument Parsing Function

### `getArgs(args)`

This function takes an array of argument strings and returns an object mapping keys to values. This functionality is exportable, allowing it to be used in other parts of the application.

**Parameters:**
- `args` (Array): An array of command-line arguments (defaults to `process.argv`).

**Returns:**
- An object with key-value pairs parsed from the command-line arguments.

## API Key and Instruction Management

```javascript
let apiKey = "";
let instructions = `You are receiving source code from...`;

// Parse CLI arguments
export const args = getArgs();
```

The API key is declared but must be provided by the user or via command-line arguments. Instructions are provided to guide the GPT model in generating documentation.

## Configuration Management

### `setConfig(apiKey, assistantId, threadId)`

Stores configuration details like the API key, assistant ID, and thread ID in a `config.txt` file.

### `getConfig()`

Retrieves the stored configuration details from the `config.txt` file.

## OpenAI API Interaction

The file uses the `openai` module instance to communicate with the OpenAI API, handling rate limits, maximum token sizes, and setting up assistants and threads per the provided configuration.

### `ask(options)`

An asynchronous function that interacts with an OpenAI GPT model. It sends a prompt, along with optional instructions and receives a response.

**Parameters:**
- `options` (Object): Contains model, prompt, instructions, threadId, etc.

**Returns:**
- A promise that resolves with the text response from the OpenAI GPT model.

### Usage

```javascript
ask({
    model: 'gpt-3.5-turbo',
    prompt: 'Hello! How can we assist today?',
    instructions: 'Provide helpful responses only.'
}).then(response => {
    console.log(response.text);
});
```

## Documentation Generation Functions

### `generateReadme(entryPoint, threadId, instructions)`

Generates a `README.md` file based on a provided template or a set of instructions and an entry point directory.

### `generateDocumentation(entryPoint, initialFiles, fileExtensions, excluded, extraInstructions)`

Generates markdown documentation for a given set of source files. It recursively reads file contents and requests the OpenAI model to create the documentation.

## Usage Example

```javascript
// Example usage to generate documentation
generateDocumentation(process.cwd(), ['utils.js', 'gptdocument.js'], ['.js'], ['server.js', 'node_modules']);
```

Invoke this command to start documenting your source code marvelously or to start questioning why you didn't become a gardener instead!

---

Remember, the `utils.js` is the gateway to automating your markdown-based developer documentation. Customize the file to your liking but ensure that you have access to OpenAI services and have set the appropriate configuration to avoid the typical "AI charging but not starting" conundrum. 🤖✨