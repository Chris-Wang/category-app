const fs = require('fs');

const dataFile = 'store/data.json';

function loadData() {
  try {
    const data = fs.readFileSync(dataFile);
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

function saveData(text) {
  const jsonData = JSON.stringify(text);
  fs.writeFileSync(dataFile, jsonData);
}

module.exports = {
  loadData,
  saveData,
};
