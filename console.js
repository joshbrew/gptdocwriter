
export const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
  
    fg: {
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
    },
  
    bg: {
      black: "\x1b[40m",
      red: "\x1b[41m",
      green: "\x1b[42m",
      yellow: "\x1b[43m",
      blue: "\x1b[44m",
      magenta: "\x1b[45m",
      cyan: "\x1b[46m",
      white: "\x1b[47m",
    }
};
  
export function colorText(text, color) {
    return colors.fg[color] + text + colors.reset;
} 

//get command line args either "--key value" or "key=value"
export const getArgs = (args = process.argv) => {
    const argMap = {};
    let currentKey = null;
    console.log(args);
    for (let i = 0; i < args.length; i++) {
      const v = args[i];
      if(currentKey !== null) {
          // Check if currentKey's value is comma-separated and convert to an array if so
          if((args[i+1]?.includes('--') || args[i+1]?.includes('='))) {
            if(argMap[currentKey] === '') {
              argMap[currentKey] = true;
            }
            currentKey = null;
          } else {
            argMap[currentKey] += ((i > 0 && !(args[i-1]?.includes('--') || args[i-1]?.includes('='))) ? (' ' + v) : v);
            if(argMap[currentKey].startsWith('[') && argMap[currentKey].endsWith(']')){
              argMap[currentKey] = argMap[currentKey].substring(1,argMap[currentKey].length-1).split(' '); //commas get replaced with spaces so we just do this
              currentKey = null; //we're gonna assume these are explicit arrays
            }
          }
      } else if (v.startsWith('--')) {
        currentKey = v.replace(/^-+/g, '').trim(); // Remove all leading dashes
        argMap[currentKey] = '';
      } else if (v.includes('=')) {
        const split = v.split('=');
        const key = split[0].replace(/^-+/g, '').trim(); // Remove leading dashes from key
        const value = split[1];
        argMap[key] = value;
        if(argMap[key].startsWith('[') && argMap[key].endsWith(']')){
          argMap[key] = argMap[key].substring(1,argMap[key].length-1).split(' '); //commas get replaced with spaces so we just do this
          currentKey = null; //we're gonna assume these are explicit arrays
        }
        currentKey = key;
      }
    }
  
    return argMap;
};