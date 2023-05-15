const readline = require('readline');
const fs = require('fs');
const categoryController = require('./controllers/category.controller');
const categoryView = require('./views/category.view');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getInputFileName() {
  return new Promise((resolve, reject) => {
    rl.question('Enter input file name: ', (filename) => {
      resolve(filename);
    });
  });
}

async function main() {
  const filename = await getInputFileName();
  // Use default test file for fast test
  // const filename = 'example.txt';
  try {
    const text = fs.readFileSync(filename, 'utf8');
    categoryController.processInputFile(text);
    const data = categoryController.loadData();

    if (data) {
      categoryView.displayTable(data);
    }
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    console.log('❌ Application stopped because of above error');
  } finally {
    rl.close();
  }
}

main();
