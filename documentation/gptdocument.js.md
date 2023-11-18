# GPT Document CLI Tool: `gptdocument.js`

The `gptdocument.js` is the command-line interface (CLI) entry point for the GPT Doc Writer, a tool designed to automate the generation of documentation using the GPT-4 AI model from OpenAI. Whether you're in it for the state-of-the-art technology or because you're too lazy to write docs, this tool's got you covered.

## Overview

This script is invoked from the command line and utilizes parameters and arguments specified by the user to customize the generation of documentation. It is written in JavaScript, meant to be executed with Node.js, and it imports functionalities from `./utils.js`.

## Features

- Set an API key for authenticating with the OpenAI API.
- Generate documentation based on specified entry points, file types, and other criteria.
- Exclude certain files or directories from being documented.
- Define custom models, output formats, and additional instructions for the AI to follow.

## Usage

Here's how you use the command line incantations to conjure up the documentation:

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

# Tailor the prompt for the AI
gptdocwriter --instructions "Write detailed documentation about each file"

# Include additional specific instructions
gptdocwriter --extraInstructions "Mention the CLI input arguments"

# Specify the project name within the readme
gptdocwriter --name gptdocwriter

# Change the output format to another language
gptdocwriter --outputFormat .py

# Adjust the readme content template
gptdocwriter --readme "Summarize this in a digestible format for folks who got a D in English"
```

Remember, to execute this script directly from the command line, you would need to have execution permissions:

```bash
chmod +x gptdocument.js
```

## Execution

The script checks for an API key and primarily focuses on processing the arguments passed to it:

1. **api key**: If provided, it saves it for library configurations.
2. **initialFiles, extensions, excluded**: Transforms comma-separated strings into arrays for processing.
3. **entryPoint**: Defines where to begin the documentation process.
4. **extensions**: File extensions to include by default (`.js, .ts, .mjs, .jsx, .tsx`).
5. **excluded**: Folders or file patterns to ignore (such as `dist/` and `node_modules/`).

The script then calls the `generateDocumentation` function from `utils.js` with the provided arguments or defaults when not specified.

## Note for Developers

Be cautious while running these magical spells. While GPT-4 is undoubtedly clever, it's still a few updates away from making lattes or predicting stock markets. Always review the generated documentation for consistency, accuracy, and the odd Easter egg.

When crafting a CLI tool such as this, remember that the power it wields is immense. With great power comes great responsibility, and possibly a few bugs. Report issues to your local Git Wizard or file them in the repository if you feel adventurous.

Good documentation is like a love letter to your future self, and with this CLI, you're practically serenading them. Now go forth and let the automated doc magic begin, and may the force of documentation be with you!