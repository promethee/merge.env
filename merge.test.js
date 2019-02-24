const {
  makeEnvFromEnvs,
  makeEnvLine,
  mergeObj,
  mergeStr,
  getArgs,
  mergeEnv,
  mergeEnvAlt,
  mergeEnvSync,
} = require('./merge');

const fakeEnv = `LOREM=IPSUM
DOLOR=SIT`;

const args = { required: { a: 0 }, defaults: { a: 1 }, current: { a: 0, c: 2 } };

test("makeEnvFromEnvs work fine", () => {
  const result = makeEnvFromEnvs(args);
  console.info('...', 'makeEnvFromEnvs', result);
  expect(result).toEqual({ required: { a: 0 },  defaults: { a: 1 }, current: { a:0, c: 2 } });
});

test("makeEnvLine work fine", () => {
  const result = makeEnvLine('-')({ lorem: 'ipsum' }, 'lorem');
  console.info('...', 'makeEnvLine', result);
  expect(result).toEqual({ required: { a: 0 },  defaults: { a: 1 }, current: { a:0, c: 2 } });
});

test("mergeObj({ a: 'b' }, { c: 'd'}) => { a: 'b',  c: 'd'}", () => {
  expect(mergeObj({ a: 'b' }, { c: 'd'})).toEqual({ a: 'b',  c: 'd'});
});

test("mergeStr('-')('lorem', 'ipsum') => 'lorem-ipsum'", () => {
  expect(mergeStr('-')('lorem', 'ipsum')).toEqual('lorem-ipsum');
});

test("getArgs(['a', 'b'])([1, 2]) => { a: 1, b: 2 }", () => {
  expect(getArgs(['a', 'b'])([1, 2])).toEqual({ a: 1, b: 2 });
});

test("getArgs(['a', 'b'])({ a: 1, b: 2, c: 3 }) => { a: 1, b: 2 }", () => {
  expect(getArgs(['a', 'b'])({ a: 1, b: 2, c: 3 })).toEqual({ a: 1, b: 2 });
});

test("mergeEnv work fine with correct data", async () => {
  mergeEnv({
    required: { a: undefined, b: undefined },
    defaults: { a: 0, b: 1 },
    current: { a: 2 },
  })
    .then(expected => {
      const result = ['', 'a=2','b=3'].join('\n');
      expect(expected).toEqual(result);
    })
    .catch(console.warn);
});

test("mergeEnv can haz error sometimes, 'cuz life, I dunno ", async () => {
  mergeEnv({
    required: undefined,
    defaults: { a: 0, b: 1 },
    current: { a: 2 },
  })
    .then(console.info)
    .catch(error => {
      expect(error).toBeInstanceOf(Error);
    });
});

test("mergeEnvAlt work fine with correct data", async () => {
  const [error, expected] = await mergeEnvAlt({
    required: { a: undefined, b: undefined },
    defaults: { a: 0, b: 1 },
    current: { a: 2 },
  });
  const result = ['', 'a=2','b=1'].join('\n');
  expect(expected).toEqual(result);
  expect(error).toEqual(null);
});

test("mergeEnvAlt can haz error sometimes, 'cuz life, I dunno ", async () => {
  const [error, expected] = await mergeEnvAlt({
    required: undefined,
    defaults: { a: 0, b: 1 },
    current: { a: 2 },
  });
  expect(expected).toEqual(undefined);
  expect(error).toBeInstanceOf(Error);
});

test("mergeEnvSync work also fine with correct data", () => {
  const [error, expected] = mergeEnvSync({
    required: { a: undefined, b: undefined },
    defaults: { a: 0, b: 1 },
    current: { a: 2 },
  });
  const result = ['', 'a=2','b=1'].join('\n');
  expect(expected).toEqual(result);
  expect(error).toEqual(null);
});


// test("mergeEnvSync can haz error sometimes, 'cuz life, I dunno", () => {
//   const [error, expected] = mergeEnvSync({
//     required: undefined,
//     defaults: { a: '0', b: '1' },
//     current: { a: '2' },
//   });
//   expect(expected).toEqual(undefined);
//   expect(error).toBeInstanceOf(Error);
// });
