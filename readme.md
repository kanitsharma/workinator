# Workinator
> Run your CPU intensive functions in a separate thread on the fly, and keep your application running at 60FPS.

- Works on both Browser or Nodejs
- Minimal API
- Tiny package, ~1KB gzipped
- Supports both synchronous or asynchronous code.
- Automatically cleans up memory after worker thread is finished executing.

## How it works
```javascript
  import workinator from '@kimera/workinator';

  const work = () => {
    // blocking thread for 2 secs
    const start = new Date().getTime();
    while (new Date().getTime() < start + 2000) { }

    return 'Work finished'
  }

  const main = async () => {
    const status = await workinator(work);
    console.log(status);
  }

  main()
```

### Thats it!.

## Async with promises

```javascript
  import workinator from '@kimera/workinator';

  workinator(() => new Promise(resolve => {
    setTimeout(() => {
      resolve('Work Finished');
    }, 2000)
  })).then(console.log)

  // or

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  workinator(async () => {
    await sleep(2000);
    return 'Work Finished';
  }).then(console.log)
```