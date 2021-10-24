const dayjs = require('dayjs');
import { blue, cyan, magenta, red, yellow } from './colors';

const MODULE = 'parser';
enum LEVEL {
  TRACE = 0,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

const time = () => dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS');
const level = process.env.LOG_LEVEL?.toLocaleUpperCase() || 'DEBUG';
const getFileAndLineNumber = () => {
  let initiator = 'unknown place';
  try {
    throw new Error();
  } catch (e) {
    if (typeof e.stack === 'string') {
      const lines = e.stack.split('\n');
      const path =
        process.env.NODE_ENV === 'production' ? '/dist/' : `${MODULE}/`;
      const regex = new RegExp(`^\\s*at\\s+.+(${path}.+)\/([\\w:.]+)`);
      const matches = lines[3].match(regex);
      if (matches) {
        initiator = `${matches[1]} at ${matches[2]}`;
      }
    }
  }
  return initiator;
};
const getFullStackTrace = () => {
  let initiator = 'unknown place';
  try {
    throw new Error();
  } catch (e) {
    initiator = e.stack;
  }
  return initiator;
};

const log = {
  trace: (...rest): null => {
    if (LEVEL[level] <= LEVEL.TRACE) {
      console.log(cyan(`${time()} : T : ${getFileAndLineNumber()} `), ...rest);
    }
    return null;
  },
  debug: (...rest): null => {
    if (LEVEL[level] <= LEVEL.DEBUG) {
      console.log(
        magenta(`${time()} : D : ${getFileAndLineNumber()} `),
        ...rest
      );
    }
    return null;
  },
  info: (...rest): null => {
    if (LEVEL[level] <= LEVEL.INFO) {
      console.log(blue(`${time()} : I : ${getFileAndLineNumber()} `), ...rest);
    }
    return null;
  },
  warn: (...rest): null => {
    if (LEVEL[level] <= LEVEL.WARN) {
      console.log(
        yellow(`${time()} : W : ${getFileAndLineNumber()} `),
        ...rest
      );
    }
    return null;
  },
  error: (...rest): null => {
    if (LEVEL[level] <= LEVEL.ERROR) {
      console.log(red(`${time()} : E : \n${getFullStackTrace()} `), ...rest);
    }
    return null;
  },
  all: (...rest) => {
    console.log(cyan(`${time()} : A : ${getFileAndLineNumber()} `), ...rest);
    return null;
  },
};

// export const log = logger.all;

export default log;
