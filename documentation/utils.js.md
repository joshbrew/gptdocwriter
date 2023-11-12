# utils.js Overview

The `utils.js` file contains utility functions for setting and retrieving an API key, parsing command line arguments, initializing the ChatGPTAPI, creating a README, and generating documentation for source code files in a project. This file serves as a core part of a larger system designed to document source code by using the OpenAI's ChatGPT model.

## High-Level Summary

- **API Key Management**: Functions to set and get an API key for authentication.
- **CLI Argument Parsing**: Functionality to parse Command Line Interface (CLI) arguments.
- **ChatGPTAPI Initialization**: Code to initialize the ChatGPTAPI with system-specific messages and parameters.
- **Documentation Generation**: Processes for generating markdown documentation and README files for provided source code.

## Detailed Documentation

### Functions

#### `setApiKey(apiKey)`
Saves the provided API key to a file.
- **Inputs**:
  - `apiKey`: A string representing the API key to be saved. It will be recognized via commandline i.e. `--apiKey sk-abcdefg`
- **Outputs**: 
  - None. It writes the API key to a file directly.

#### `getApiKey()`
Retrieves the API key from a file or falls back to a hardcoded value if the file doesn't exist.
- **Inputs**:
  - None.
- **Outputs**: 
  - Returns the API key as a string.

#### `get(args=process.argv)`
Parses CLI arguments into a more usable format.
- **Inputs**:
  - `args`: An array of strings representing the command-line arguments. Default is `process.argv`.
- **Outputs**: 
  - An object mapping argument keys to their respective values.

#### `ask(text, onProgress, parentMessageId)`
Sends a message to the ChatGPTAPI and optionally handles progress updates.
- **Inputs**:
  - `text`: The text to send to the ChatGPT API.
  - `onProgress` (optional): A function to call with partial responses.
  - `parentMessageId` (optional): The ID of the parent message for context.
- **Outputs**: 
  - Returns a promise that resolves to the full response from the ChatGPT API.

#### `generateReadme(entryPoint, onProgress, parentMessageId)`
Generates a README.md file at the specified entry point directory.
- **Inputs**:
  - `entryPoint`: Path where the README.md will be generated.
  - `onProgress` (optional): Function to handle progress updates.
  - `parentMessageId` (optional): ID of the parent message for context.
- **Outputs**: 
  - None. Writes the README.md content to disk.

#### `generateDocumentation(entryPoint, initialFiles, fileExtensions, excluded, onProgress)`
Main function to generate documentation for all source code files in a given directory.
- **Inputs**:
  - `entryPoint`: The root directory path to start documenting from.
  - `initialFiles` (optional): An array of initial file paths to document first.
  - `fileExtensions` (optional): An array of file extensions to include in documentation generation.
  - `excluded` (optional): An array of directories to exclude from documentation.
  - `onProgress` (optional): A function to handle progress updates.
- **Outputs**: 
  - None. Generates markdown documentation and organizes it within the 'documentation' directory.

### Constants and Initializations

- `systemMessage`: A predefined message explaining the task for developers using the tool.
- `API_KEY_FILE`: The path where the API key is stored.
- `args`: Parsed CLI arguments stored as an object.
- `api`: An instance of `ChatGPTAPI` initialized with necessary parameters.
- `lastLength`: Variable used to track the length of the last partial response from the ChatGPT API.

### Miscellaneous

- The file includes some commented example usage at the end for how to call `generateDocumentation()`.

---

**Note**: Before running this script, ensure that you have the correct permissions to write to the file system and that your environment variables are set up as expected, particularly `OPENAI_API_KEY` if not using a hardcoded API key. Use caution when managing API keys; they should not be hardcoded into version control systems.