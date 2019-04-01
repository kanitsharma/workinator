import workinator from '../src/index';

const main = () => {
  workinator(() => {
    console.log('Worker Running');
  });

  workinator(
    () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve('Another worker running');
        }, 2000);
      }),
  ).then(console.log);
};

main();
