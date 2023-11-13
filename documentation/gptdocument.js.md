# gptdocument.js Documentation

## Overview

`gptdocument.js` acts as the command-line interface (CLI) entry point for the `gptdocwriter` application. Finally, a way to interact with AI without fearing an uprising! It uses functions imported from `utils.js` to generate comprehensive documentation for your project's source code.

## Getting Started

To get started with `gptdocument.js`, run command-line instructions where this script is located after you install the necessary node modules (assuming you have already run `npm install`).

## API Key Configuration

First things first, without an API key, this script runs as well as a car without gas. If you're looking to just set the API key, you use:

```bash
gptdocwriter --apiKey your_openai_api_key
```

After running this, you'll be on a first-name basis with OpenAI's API.

## CLI Usage

The script can be run with several options to customize the documentation generation:

- **initialFiles**: The files to start the documentation journey. It's like choosing the first members of your zombie apocalypse team.
  - Example: `--initialFiles utils.js,gptdocument.js`
- **excluded**: Files or directories you'd rather not document. Think of it as the 'not my job' field.
  - Example: `--excluded server.js,node_modules,dist`
- **extensions**: A list of file extensions to document. Because sometimes you want to ignore `.txt` files - they're rarely the cool kids.
  - Example: `--extensions js,ts,tsx,jsx`
- **model**: Specify the OpenAI model to be used. Defaults are good, but choices keep life spicy.
  - Example: `--model gpt-4-turbo-1106`
- **cleanup**: If provided, cleans up before starting the doc generation. Think of this as the script taking a shower before putting in the work.
  - Provide as `--cleanup`
- **extraInstructions**: Want to add special instructions to the AI? Here you go.
  - Example: `--extraInstructions "Make sure you specifically list the input arguments for the CLI"`
- **name**: Give your documentation its own identity.
  - Example: `--name mySuperCoolDoc`

## Examples

Setting up the API key:

```sh
gptdocwriter --apiKey sk-abcdefg
```

Running the documentation generator with custom settings:

```sh
gptdocwriter --initialFiles utils.js,gptdocument.js --excluded server.js,node_modules,dist --extensions js,ts,tsx,jsx
```

## Conversion of Arguments

A neat feature in `gptdocument.js` is its ability to magically turn comma-separated arguments into arrays. It's less of a rabbit out of a hat and more of a usability charm:

```javascript
if(args.extensions && !Array.isArray(args.extensions)) args.extensions = [args.extensions];
```

The same is done for `initialFiles` and `excluded`.

## Function Call

The `generateDocumentation` function is called as the pièce de résistance, the grand finale where all your options come together to start creating the documentation:

```javascript
generateDocumentation(
    args.entryPoint ? args.entryPoint : process.cwd(), 
    args.initialFiles ? args.initialFiles : undefined, 
    args.extensions ? args.extensions : ['.js', '.ts', '.mjs', '.jsx', '.tsx'], 
    args.excluded ? args.excluded : ['dist','node_modules']
);
```

Notice how it smartly defaults to current working directory if `entryPoint` is missing, or adds a universal set of file extensions if none were specified, and excludes common non-document-worthy folders like `'dist'` and `'node_modules'`.

## Conclusion

Using `gptdocument.js` is like having a personal documentation genie — sure, it won't grant you three wishes, but it will document your code in a way that might just make you feel like it did. Simply tailor the command-line arguments to fit the uniqueness of your project, and watch magic unfold. And remember, the more accurate your arguments, the less weird your documentation will look — because nobody wants documentation with an identity crisis.