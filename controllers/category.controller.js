const ioConnect = require('../db/connect');
const util = require('../util');
const CategoryManager = require('../services/categoryManager.service');

function loadData() {
  const data = ioConnect.loadData();
  if (data) {
    return data;
  } else {
    console.log('🦘 No saved data found.');
    return null;
  }
}

function saveData(text) {
  ioConnect.saveData(text);
}

function processCommands(commands, categoryManager) {
  console.log(
    `📦 Find ${commands.length} ${
      commands.length > 1 ? 'commands' : 'command'
    } `
  );
  for (let i = 0; i < commands.length; i++) {
    const [command, ...args] = commands[i].trim().split(' ');
    if (args.length === 0) {
      throw new Error(`Command with no argument`);
    }
    if (!['ADD', 'DELETE', 'RENAME', 'MOVE'].includes(command)) {
      throw new Error(`Didn't find this command: ${command}`);
    }
    const argProcessMap = {
      ADD: processAddArg(args, command, categoryManager),
      DELETE: processDeleteArg(args, command, categoryManager),
      RENAME: processEditArg(args, command, categoryManager),
      MOVE: processMoveArg(args, command, categoryManager),
    };
    const commandArgs = argProcessMap[command];
    categoryManager.executeCommand(command, commandArgs);
  }
}

function processAddArg(args, command, categoryManager) {
  if (command === 'ADD') {
    let category;
    const level = args.length;
    const name = args[args.length - 1].replace(/["“”]/g, '');
    if (!util.isValidName(name)) {
      throw new Error(`Category name: ${name} is invalid`);
    }
    if (level !== 1) {
      // TODO: need to check the existence of its upper level parent
      const parentName = args[args.length - 2].replace(/["“”]/g, '');
      const parentId = categoryManager.findParentId(parentName, level);
      if (!parentId) {
        throw new Error(`Parent category ${parentName} does not exist`);
      }
      const index = categoryManager.getNextIndex(parentId, level);
      category = categoryManager.createCategory(
        name,
        parentId,
        [],
        level,
        index
      );
    } else {
      const index = categoryManager.getNextIndex(0, level);
      category = categoryManager.createCategory(name, 0, [], level, index);
    }
    console.log(`📦 Adding category ${name}`);
    return { category, level };
  }
}

function processDeleteArg(args, command, categoryManager) {
  if (command === 'DELETE') {
    const level = args.length;
    const name = args[args.length - 1].replace(/["“”]/g, '');
    const targetCategory = categoryManager.findCategoryByName(name, level);
    if (!targetCategory) {
      throw new Error(`Category: ${name} does not exist`);
    }
    if (level !== 1) {
      // TODO: need to check the existence of its upper level parent
      const parentName = args[args.length - 2].replace(/["“”]/g, '');
      const parentId = categoryManager.findParentId(parentName, level);
      if (!parentId) {
        throw new Error(`Parent category ${parentName} does not exist`);
      }
    }
    console.log(`📦 Deleting category ${name}`);
    return { category: targetCategory, level };
  }
}

function processEditArg(args, command, categoryManager) {
  if (command === 'RENAME') {
    const level = args.length - 2;
    const newName = args[args.length - 1].replace(/["“”]/g, '');
    const nameCommand = args[args.length - 2];
    const currentName = args[args.length - 3].replace(/["“”]/g, '');
    if (!util.isValidName(newName)) {
      throw new Error(`Category name: ${newName} is invalid`);
    }
    if (nameCommand !== 'AS') {
      throw new Error(`Didn't find AS command after categories for renaming`);
    }
    const targetCategory = categoryManager.findCategoryByName(
      currentName,
      level
    );
    if (!targetCategory) {
      throw new Error(`Category: ${currentName} does not exist`);
    }
    if (level !== 1) {
      // TODO: need to check the existence of its upper level parent
      const parentName = args[args.length - 4].replace(/["“”]/g, '');
      const parentId = categoryManager.findParentId(parentName, level);
      if (!parentId) {
        throw new Error(`Parent category ${parentName} does not exist`);
      }
    }
    console.log(`📦 Renaming category ${currentName}`);
    return { category: targetCategory, name: newName };
  }
}

function processMoveArg(args, command, categoryManager) {
  if (command === 'MOVE') {
    const level = args.length - 2;
    const count = args[args.length - 1];
    const reorderCommand = args[args.length - 2];
    const name = args[args.length - 3].replace(/["“”]/g, '');
    if (!['UP', 'DOWN'].includes(reorderCommand)) {
      throw new Error(
        `Didn't find UP or DOWN command after categories for moving`
      );
    }
    const targetCategory = categoryManager.findCategoryByName(name, level);
    if (!targetCategory) {
      throw new Error(`Category: ${name} does not exist`);
    }
    if (level !== 1) {
      // TODO: need to check the existence of its upper level parent
      const parentName = args[args.length - 4].replace(/["“”]/g, '');
      const parentId = categoryManager.findParentId(parentName, level);
      if (!parentId) {
        throw new Error(`Parent category ${parentName} does not exist`);
      }
    }
    console.log(`📦 Moving category ${name}`);
    return { category: targetCategory, command: reorderCommand, count, level };
  }
}

async function processInputFile(inputFile) {
  try {
    const data = ioConnect.loadData();
    const categoryManager = new CategoryManager(data);
    console.log('✅ Data loaded');
    const commands = inputFile.split('\n').filter((line) => line.trim() !== '');
    processCommands(commands, categoryManager);
    console.log('📦 Saving data');
    ioConnect.saveData(categoryManager);
    console.log('✅ Data saved');
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    console.log('❌ Application stopped because of above error');
  }
}

module.exports = {
  loadData,
  saveData,
  processInputFile,
};
