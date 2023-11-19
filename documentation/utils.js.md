
# `utils.js`

The `utils.js` file serves as a central hub for utility functions needed by the GPT Doc Writer application. This application facilitates the automated creation of comprehensive developer documentation by leveraging OpenAI's GPT-4 model. This file handles the parsing of command-line interface (CLI) arguments, manages configuration settings, and controls interactions with the OpenAI API.

---

## Getting Started

To use this utility, you will typically begin by setting the API key for OpenAI services. You can do this either through the CLI argument `--apiKey` or by modifying the `apiKey` variable in the code directly.

Example CLI usage:

```bash
gptdocwriter --apiKey sk-abcdefg
```

You can combine a variety of arguments to control the behavior of the GPT Doc Writer, such as specifying entry points, excluding files, or changing the output format of the generated documentation.

### Configuration and CLI Arguments

The `args` constant is exported from the file and is initialized by calling the `getArgs` function from `./console.js`. It contains the processed CLI arguments as an object, which can be used throughout other parts of the application.

```javascript
export const args = getArgs();
```

### API Key and Assistant Management

The `setConfig` and `getConfig` functions are designed to manage the API key and Assistant ID, storing them in a local configuration file.

### OpenAI Integration

The file imports the `OpenAI` class and initializes it with the API key. It also controls the GPT-4 model choice and access to other models if necessary.

```javascript
const openai = new OpenAI({
  apiKey,
});
```

### Interaction Function

The `ask` function is a critical part of the code, providing the capability to interact with the chosen OpenAI model using a prompt and receive comprehensive responses. It handles messaging, creating and running threads, and polling for the completion of interactions.

### Documentation Generation

The `generateReadme` and `generateDocumentation` functions are responsible for reading the files and their contents in a provided directory, generating the documentation using GPT-4, and saving it in markdown or other specified formats.

### Usage Example

To generate documentation for your project, you can call the `generateDocumentation` function manually in your script, or use it as part of an automated process:

```javascript
//generateDocumentation(); // Uncomment and call with appropriate parameters
```

---

## Warning

While `utils.js` is equipped with error handling, never overestimate its capability to handle the absurd intricacies of your spaghetti code. The AI might just throw a digital tantrum.

---

Hope this gives you a moment of respite from stack overflows and off-by-one errors. Happy documenting!
