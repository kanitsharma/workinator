function getJSWorker(fn, ...args) {
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

function getNodeWorker(fn, ...args) {
  return `
    const { parentPort } = require('worker_threads');

    const a = (${fn})(${args.join(', ')})
    if (Promise.resolve(a) == a) {
      a.then(parentPort.postMessage)
    } else {
      parentPort.postMessage(a);
    }
  `;
}

function workinator(fn, ...args) {
  if (typeof window === 'undefined') {
    const functionString = getNodeWorker(fn, ...args);
    const { Worker } = eval('require')('worker_threads'); // eslint-disable-line

    return new Promise(resolve => {
      const worker = new Worker(functionString, { eval: true });
      worker.on('message', resolve);
    });
  }

  const functionString = getJSWorker(fn, ...args);

  const blob = new Blob([functionString.replace('"use strict";', '')]); // eslint-disable-line no-undef

  // eslint-disable-next-line no-undef
  const blobURL = (window.URL ? URL : webkitURL).createObjectURL(blob, {
    type: 'application/javascript; charset=utf-8',
  });

  // eslint-disable-next-line no-undef
  const worker = new Worker(blobURL);

  return new Promise(resolve => {
    worker.onmessage = e => {
      resolve(e.data);
    };
  });
}

export default workinator
