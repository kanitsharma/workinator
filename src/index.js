function getJSWorker(fn, ...args) {
  return `
    const self = this;

    try {
      const a = (${fn})(${args.join(', ')})
      if (Promise.resolve(a) == a) {
        a
          .then(val => self.postMessage({ type: 'SUCCESS', payload: val }))
          .catch(err => self.postMessage({ type: 'ERROR', payload: err }))
      } else {
        self.postMessage({ type: 'SUCCESS', payload: a });
      }
    } catch (err) {
      self.postMessage({ type: 'ERROR', payload: err })
    }
  `;
}

function getNodeWorker(fn, ...args) {
  return `
    const { parentPort } = require('worker_threads');

    try {
      const a = (${fn})(${args.join(', ')})
      if (Promise.resolve(a) == a) {
        a
          .then(val => parentPort.postMessage({ type: 'SUCCESS', payload: val }))
          .catch(err => parentPort.postMessage({ type: 'ERROR', payload: err }))
      } else {
        parentPort.postMessage({ type: 'SUCCESS', payload: a });
      }
    } catch (err) {
      parentPort.postMessage({ type: 'ERROR', payload: err })
    }
  `;
}

function createJSFile(string) {
  const blob = new Blob([string.replace('"use strict";', '')]); // eslint-disable-line no-undef

  // eslint-disable-next-line no-undef
  const blobURL = (window.URL ? URL : webkitURL).createObjectURL(blob, {
    type: 'application/javascript; charset=utf-8',
  });

  return blobURL;
}

function resolver(action, resolve, reject) {
  switch (action.type) {
    case 'SUCCESS':
      return resolve(action.payload);
    case 'ERROR':
      return reject(action.payload);
  }
}

function workinator(fn, ...args) {
  // NodeJS
  if (typeof window === 'undefined') {
    const functionString = getNodeWorker(fn, ...args);
    const { Worker } = eval('require')('worker_threads'); // eslint-disable-line

    return new Promise((resolve, reject) => {
      const worker = new Worker(functionString, { eval: true });
      worker.on('message', action => {
        resolver(action, resolve, reject);
        worker.terminate();
      });
      worker.on('error', reject);
    });
  }

  // Else in browser
  const fileString = getJSWorker(fn, ...args);
  const file = createJSFile(fileString);

  // eslint-disable-next-line no-undef
  const worker = new Worker(file);

  return new Promise((resolve, reject) => {
    worker.onmessage = ({ data: action }) => {
      resolver(action, resolve, reject);
    };
    worker.onerror = () => reject(new Error('There is some error in your worker'));
    worker.terminate();
  });
}

export default workinator;
