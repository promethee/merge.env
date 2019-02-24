const keys = ['required', 'defaults', 'current'];

const mergeObj = (a, b) => ({ ...a, ...b });

const mergeStr = (separator = '\n') => (a, b) => `${a}${separator}${b}`;

const makeEnvLine = (separator = '=') => obj => k => `${k}${separator}${obj[k]}`;

const getArgs = (keysList = keys) => args => {
  const isArray = Array.isArray(args);
  return keysList.reduce((a, k, i) => ({ ...a, [k]: isArray ? args[i] : args[k] }), {});
};

const makeEnvFromEnvs = args => {
  const { required, current, defaults } = getArgs()(args);
  return {
    ...required,
    ...defaults,
    ...current,
  };
};

const mergeEnv = args => new Promise((resolve, reject) => {
  try {
    const env = makeEnvFromEnvs(args);
    const result = Object.keys(env)
      .filter(key => Object.keys(env.required).includes(key))
      .map(makeEnvLine('=')(env))
      .reduce(mergeStr(), '');
    resolve(result);
  } catch(error) {
    reject(error);
  }
});

const mergeEnvAlt = args => new Promise(resolve => {
  try {
    const env = makeEnvFromEnvs(args);
    const result = Object.keys(env)
      .filter(key => Object.keys(env.required).includes(key))
      .map(makeEnvLine('=')(env))
      .reduce(mergeStr(), '');
    resolve([null, result]);
  } catch(error) {
    resolve([error]);
  }
});

const mergeEnvSync = args => {
  try {
    const env = makeEnvFromEnvs(args);
    console.info('...', 'mergeEnvSync', env);
    const result = Object.keys(env)
      .filter(key => Object.keys(env.required).includes(key))
      .map(makeEnvLine('=')(env))
      .reduce(mergeStr(), '');
    return [null, result];
  } catch(error) {
    return [error];
  }
};

module.exports = {
  makeEnvFromEnvs,
  makeEnvLine,
  mergeObj,
  mergeStr,
  getArgs,
  mergeEnv,
  mergeEnvAlt,
  mergeEnvSync
};
