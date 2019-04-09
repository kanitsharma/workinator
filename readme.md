<p align="center" ><img src="docs/logo.png" width="200"/></p>

<h1 align="center"> Workinator</h1>

<p align="center">
  <a href="https://github.com/prettier/prettier">
        <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="prettier"/>
  </a>
<a href="https://github.com/rajatsharma/enginite">
        <img src="https://img.shields.io/badge/enginite-generator-orange.svg" alt="enginite"/>
  </a>
  <a href="https://packagephobia.now.sh/result?p=@kimera/workinator">
  <img src="https://packagephobia.now.sh/badge?p=@kimera/workinator" alt="workinator">
  </a>
</p>

> Run your CPU intensive functions in a separate thread on the fly, and keep your application running at 60FPS.

- Works on both Browser or Nodejs
- Minimal API
- Tiny package, ~1KB gzipped
- Supports both synchronous or asynchronous code.
- Automatically cleans up memory after worker thread is finished executing.

## Getting Started

```javascript
  yarn add @kimera/workinator
  // or
  npm i @kimera/workinator
```

## How it works

### Basic
```javascript
import workinator from '@kimera/workinator';

workinator(() => {
  console.log('Hello from worker');
})

// Thats it!.
```

### Synchronous
```javascript
import workinator from '@kimera/workinator';

const work = () => {
  // blocking thread for 2 secs
  const start = new Date().getTime();
  while (new Date().getTime() < start + 2000) {}

  return 'Work finished';
};

const main = async () => {
  const status = await workinator(work);
  console.log(status);
};

main();
```

## Async with promises

```javascript
import workinator from '@kimera/workinator';

workinator(
  () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve('Work Finished');
      }, 2000);
    }),
).then(console.log);

// or

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

workinator(async () => {
  await sleep(2000);
  return 'Work Finished';
}).then(console.log);
```

## Using Dependencies

Worker functions inside workerinator does not allow using closures, since its executed inside a different thread. So, instead what we can do is inject these dependencies as the second argument of workerinator and you will receive the dependencies as arguments inside worker function in their respective order.

### Example

```javascript
import workinator from '@kimera/workinator';

const log = x => console.log(x);

workinator(
  logger =>
    new Promise(resolve => {
      logger('Dependency working');
    }),
  log,
)
```
