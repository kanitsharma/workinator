import workinator from '../src/index';

const main = () => {
  workinator(() => {
    console.log('Worker Running');
  });
};

main();
