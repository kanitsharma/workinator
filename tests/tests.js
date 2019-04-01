import test from 'ava';
import workinator from '../build/main';

test('Basic', async t => {
  const value = await workinator(() => 1000);
  t.is(value, 1000);
});

test('Heavy Computation', async t => {
  const value = await workinator(() => {
    let x = 0;
    while (x < 10000000) {
      x += 1;
    }
    return x;
  });
  t.is(value, 10000000);
});

test('Delayed with promise', async t => {
  const value = await workinator(
    () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(1000);
        }, 2000);
      }),
  );
  t.is(value, 1000);
});

test('Error without promise', async t => {
  try {
    await workinator(() => {
      throw 'Intentional throwing';
    });
  } catch (err) {
    t.is(err, 'Intentional throwing');
  }
});

test('Error with promise', async t => {
  try {
    await workinator(
      () =>
        new Promise((_, reject) => {
          reject('Intentional throwing');
        }),
    );
  } catch (err) {
    t.is(err, 'Intentional throwing');
  }
});

test('Multiple workers', async t => {
  const value1 = await workinator(
    () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(1000);
        }, 2000);
      }),
  );
  const value2 = await workinator(
    () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(2000);
        }, 2000);
      }),
  );
  t.deepEqual([value1, value2], [1000, 2000]);
});
