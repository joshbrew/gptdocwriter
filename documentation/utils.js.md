# utils.js

`utils.js` is a utility module responsible for handling various tasks aimed at setting up and interacting with the OpenAI GPT models for generating developer documentation. This module helps parse command-line arguments, manages configuration files for API credentials, and provides functions to communicate with the OpenAI API.

## Usage

```javascript
// Import the necessary functions
import { getArgs, setConfig, getConfig, ask, generateReadme, generateDocumentation } from './utils.js';

// Use `getArgs` to parse your command-line arguments
const args = getArgs();

// Configure your OpenAI API settings with `setConfig`
setConfig(apiKey, assistantId, threadId);

// Retrieve API configurations with `getConfig`
const config = getConfig();

// Use `ask` to send a prompt to the GPT model and receive a response
const response = await ask({
  prompt: 'Your prompt here',
  instructions: 'Additional instructions',
});

// Generate a README.md file for your project
await generateReadme(entryPoint, threadId, instructions);

// Generate comprehensive documentation for your project
await generateDocumentation(entryPoint, initialFiles, fileExtensions, excluded, extraInstructions);
```

Remember to use the proper command-line arguments as these will be crucial in guiding the documentation generation process.

## Command-Line Arguments Parsing

The `utils.js` file exports a function `getArgs` which parses the command-line arguments. Accepted argument formats include `--key value` and `key=value`. The function returns an object with argument names as keys.

```javascript
const args = getArgs();
```

The module uses these arguments to orchestrate the documentation generation process, including setting up the OpenAI API key, choosing the model to use, managing files and extensions to include or exclude in the documentation, as well as any additional instructions.

## API Key and Configuration Management

The `setConfig` and `getConfig` functions manage the API key and other configuration details necessary for the OpenAI service to function. This configuration allows you to persistently store and retrieve settings.

```javascript
setConfig(apiKey, assistantId, threadId);
const config = getConfig();
```

The configuration is stored in a `config.txt` file within the same directory as `utils.js`.

## OpenAI Model Interaction

The `ask` function is a utility to interact with the chosen OpenAI model using a prompt, additional instructions, and system message. It can handle message chunking and retries in case of failures, and it provides options to clean up resources when finished.

```javascript
const response = await ask({
  prompt: 'Please document the following code...',
  instructions: 'Your additional instructions here',
});
```

The response from this function is an object containing the resulting text and the thread ID used during the interaction.

## Documentation Generation

The `generateReadme` and `generateDocumentation` functions work with the OpenAI model to create Markdown documentation for given entry points (typically your project's root directory).

```javascript
await generateReadme(entryPoint, threadId, instructions);
await generateDocumentation(entryPoint, initialFiles, fileExtensions, excluded);
```

These functions will navigate your project's file structure, parse files, and generate respective Markdown documentation recursively, including a `README.md` for your project.

## Notes for the Users

- Ensure you have the required permissions to read and write files within the project directory.
- The AI key for the OpenAI service must be set either via an environment variable or through the `--apiKey` command-line argument.

## Miscellany and Codemaster's Whimsy

Careful not to slip on the semicolons; they're the coding equivalent of LEGO bricks on a carpeted floor in the middle of the night. And remember, recursion is your friend, until you hit the stack limit—that's when it stabs you in the back.

Now, go forth and document with the fervor of a caffeinated scribe armed with the might of AI. May your JSDocs be verbose and your block comments be ever witty. Happy documenting!