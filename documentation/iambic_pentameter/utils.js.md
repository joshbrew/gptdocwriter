
# Utils.js Documentation

## Overview

This `utils.js` module is a treasure trove of utility functions,
Aiding in command line parses, interactions bright and new,
With OpenAI's potent services, for document generation flights,
By gleaming code, we'll guide the way, to facile integration sites.

## Functions

### getArgs()

The `getArgs` function is a cliff from which one can dive,
Into the process' arguments, with "--key value" drive,
Or "key=value", mapped with finesse, expeditiously contrived,
Craft a parameters' structure, with norms none contrive.

#### Usage

```javascript
import { getArgs } from './utils.js';

// Example: node script.js --foo=bar --baz "qux corge"
const args = getArgs();

// Output: { foo: "bar", baz: "qux corge" }
```

### setConfig()

`setConfig` writes to disk in `config.txt`, preserve,
API keys, assistant IDs, and thread data that you conserve.
Should one not have digits raw, or IDs to catch and curve,
'Twill write anew; falses flag delete, 'tis its nerve.

#### Usage

```javascript
import { setConfig } from './utils.js';

setConfig(apiKey, assistantId, threadId);
```

### getConfig()

From its vault, `getConfig` bestows keys and IDs,
Reading from `config.txt` file, with no complex strides.
Returns an object if found, else an empty diadem tries,
To furnish requests, lest the file no longer bides.

#### Usage

```javascript
import { getConfig } from './utils.js';

const config = getConfig();
```

### ask()

With `ask` you dispatch prompts to the OpenAI's hive,
With models that fluently converse, where threads and assistants thrive.
Provide it's prompt, watch as it writes, gently it'll contrive,
Responses in verse, prose, or instructions for code, alive.

#### Usage

```javascript
import { ask } from './utils.js';

const response = await ask({
  model: 'gpt-4-1106-preview',
  prompt: 'Explain the purpose of "utils.js" in prose.',
  instructions: 'Please maintain a professional tone.'
});
```

### generateReadme()

`generateReadme` conjures READMEs from the void that's bare,
By directive it will carve a path; to directories and files, it's fair.
A structured guide, for users' sake, with clarity bright as Sol's glare,
Ensuring no wanderer be lost, this scribe's intent is to forswear.

#### Usage

```javascript
import { generateReadme } from './utils.js';

await generateReadme(entryPoint);
```

### generateDocumentation()

To `generateDocumentation`, we present paths' list,
It browses through files to find ones that may persist,
And carves out docs to `.md` files, a navigator’s cyst,
Forewarning `excluded` glooms, and filetypes wist.

#### Usage

```javascript
import { generateDocumentation } from './utils.js';

generateDocumentation(__dirname, ['utils.js'], ['.js']);
```

## Examples of CLI commands

- Set up the API key:
  ```bash
  gptdocwriter --apiKey sk-abcdefg
  ```
  
- Generate documentation, initializing with specific files:
  ```bash
  gptdocwriter --initialFiles utils.js,gptdocument.js
  ```
  
- Exclude files or directories:
  ```bash
  gptdocwriter --excluded server.js,node_modules,dist
  ```
  
- Define OpenAI model:
  ```bash
  gptdocwriter --model gpt-4-turbo-1106
  ```
  
- Additional customization via CLI can set instructions, format, and more.

Remember to provide the API key if not using environment variables or the configuration file. To interact with OpenAI models, ensure permissions and credentials are properly configured.

Upon including `utils.js` in your projects, invoke these utilities,
To parse, ask, and document, bridging the sought after novelties,
And heed the guidance offered here, with intention and sureties,
For 'tis the foundation of doc generation, bearing these versed qualities.
`