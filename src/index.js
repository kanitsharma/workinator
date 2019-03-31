function getWorkerFunctionString(fn, ...args) {
  return `
    const self = this;
    const a = (${fn})(${args.join(', ')})
    if (Promise.resolve(a) == a) {
      a.then(self.postMessage)
    } else {
      self.postMessage(a);
    }
  `;
}

function createWorker(fn, ...args) {
  const functionString = getWorkerFunctionString(fn, ...args);

  const blob = new Blob([functionString.replace('"use strict";', '')]); // eslint-disable-line no-undef

  const blobURL = (window.URL ? URL : webkitURL).createObjectURL(blob, {
    // eslint-disable-line no-undef
    type: 'application/javascript; charset=utf-8',
  });

  const worker = new Worker(blobURL);

  return new Promise(resolve => {
    worker.onmessage = e => {
      resolve(e.data);
    };
  });
}

createWorker(
  (a, b) => {
    let start = Date.now();
    while (Date.now() - start < 1000);
    return a + b;
  },
  3,
  9,
).then(console.log);
