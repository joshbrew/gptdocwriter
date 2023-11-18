# `gptdocument.js` Documentation for GPTDocWriter

In code's firmament, a script does wake,
`gptdocument.js`, for document's sake.
Harnessing arguments, paths and skills,
To render prose where technicality fills.

## Overview

This script, dressed in Node's command line cloak,
Serves as the heart where our documentation spoke.
With `utils.js` and its exports in play,
It processes files in an automated way.

## Utilization

### Set API Key

Should an API key be what you wish,
The script will store it like a treasured dish.
Trust in these lines wherein credentials set,
For future use, without a hint of fret.

```bash
gptdocwriter --apiKey your-secret-key
```

### Generate Documentation

When API key's set, unto the main show,
Where files and directories come and go.
Convert arguments, lest they be astray,
To arrays that guide the documenter's way.

Recording the structs from whence code springs,
Extensions, paths, and such essential things.
Array conversions, subtle, rightly, done,
Prepare the field for the generator to run.

```bash
gptdocwriter --initialFiles utils.js,gptdocument.js
gptdocwriter --excluded server.js,node_modules,dist
gptdocwriter --extensions js,ts,tsx,jsx
gptdocwriter --instructions For each file, write a sonnet about it
```

### Customization Options

Diverse flags presented for the scribe's craft,
Their varied motions, forward and abaft:

- `--model` - set the AI's sage wit,
To "gpt-4-turbo", its knowledge to commit.

- `--cleanup` - maintain tidiness, post-run,
Cleaning threads, that no confusion be done.

- `--extraInstructions` - to AI, a whisper,
Detailed guidance, like a secret scripture.

- `--name` - the projected title, declared and bright,
Informs the README, casting its light.

- `--outputFormat` - switch the prose attire,
From markdown's delight to python's fire.

- `--readme` - the preamble's pattern can shift,
To a report on genetics, if you catch my drift.

## Command Example

The ways to invoke this script are myriad,
Mixed as you wish, their outcomes period:

```bash
# Set API key first
gptdocwriter --apiKey sk-abcdefg

# Combine arguments for desired action
gptdocwriter --initialFiles utils.js,gptdocument.js --excluded server.js,node_modules --extensions js,ts,tsx,jsx --model gpt-4-turbo-1106 --cleanup --instructions Write a sonnet about it --extraInstructions List the input arguments for the cli --name gptdocwriter --outputFormat .py --readme Summarize into a report on donkey genetics.
```

This script then runs, with drumming heart,
Creating docs from code, a modern art.

Invoke these truths, with terminal's might,
To conjure docs from daybreak to night.
Swiftly through Node's realm, let the script stretch,
And in its wake, wisdom it'll etch.