const Category = require('../models/category');

class CategoryManager {
  constructor(data) {
    if (data) {
      this.categories = data.categories;
    } else {
      this.categories = new Array(8);
      for (let i = 0; i < 8; i++) {
        this.categories[i] = new Array();
      }
    }
  }

  createCategory(name, parent, children, level, index) {
    return new Category(name, parent, children, level, index);
  }

  getNextIndex(parentId, level) {
    return this.categories[level - 1].filter(
      (category) => category.parent === parentId
    ).length;
  }

  executeCommand(command, args) {
    const commandMap = {
      ADD: this.addChild.bind(this),
      DELETE: this.removeChild.bind(this),
      RENAME: this.editChild.bind(this),
      MOVE: this.moveChild.bind(this),
    };

    const commandFunc = commandMap[command];
    if (commandFunc) {
      commandFunc(args);
    } else {
      console.error(`Invalid command: ${command}`);
    }
  }

  findCategoryByName(name, level) {
    return this.categories[level - 1].find((ct) => ct.name === name);
  }

  findCategoryIndex(category, level) {
    const index = this.categories[level - 1].findIndex(
      (ct) => ct.name === category.name && ct.parent === category.parent
    );
    return index;
  }

  findParentId(parentName, level) {
    const parent = this.categories[level - 2].find(
      (ct) => ct.name === parentName
    );
    if (parent) return parent.id;
    return null;
  }

  addChild({ category, level }) {
    if (level >= 7) {
      throw new Error('Maximum hierarchy depth reached');
    }
    if (this.findCategoryIndex(category, level) !== -1) {
      throw new Error(
        `This category: ${category.name} already exists under its parent category`
      );
    }
    this.categories[level - 1].push(category);
    // update its parent's children
    if (level > 1) {
      this.categories[level - 2]
        .find((ct) => ct.id === category.parent)
        .children.push(category.id);
    }
    console.log('✅ Add category DONE');
  }

  removeChild({ category, level }) {
    const index = this.categories[level - 1].findIndex(
      (ct) => ct.id === category.id
    );
    if (category.children.length !== 0) {
      throw new Error(
        `This category: ${category.name} has child node, please remove its child node firstly`
      );
    }
    // update sub category index
    const targetCategories = this.categories[level - 1].filter(
      (ct) => ct.parent === category.parent
    );
    for (
      let index = category.index + 1;
      index < targetCategories.length;
      index++
    ) {
      targetCategories[index].index = targetCategories[index].index - 1;
    }

    this.categories[level - 1].splice(index, 1);
    if (level !== 1) {
      const parentCategory = this.categories[level - 2].find(
        (ct) => ct.id === category.parent
      );
      parentCategory.children = parentCategory.children.filter(
        (child) => child !== category.id
      );
    }

    console.log('✅ Delete category DONE');
  }

  editChild({ category, name }) {
    category.name = name;
    console.log('✅ Rename category DONE');
  }

  moveChild({ category, command, count, level }) {
    const targetCategories = this.categories[level - 1]
      .filter((ct) => ct.parent === category.parent)
      .sort((a, b) => a.index - b.index);
    const countNum = parseInt(count);
    if (command === 'UP') {
      if (countNum >= category.index) {
        for (let index = 0; index < category.index; index++) {
          targetCategories[index].index = targetCategories[index].index + 1;
        }
        category.index = 0;
      } else {
        for (
          let index = category.index - countNum;
          index < category.index;
          index++
        ) {
          targetCategories[index].index = targetCategories[index].index + 1;
        }
        category.index = category.index - countNum;
      }
    }

    if (command === 'DOWN') {
      if (countNum + category.index >= targetCategories.length) {
        for (
          let index = category.index + 1;
          index < targetCategories.length;
          index++
        ) {
          targetCategories[index].index = targetCategories[index].index - 1;
        }
        category.index = targetCategories.length - 1;
      } else {
        for (
          let index = category.index + 1;
          index <= countNum + category.index;
          index++
        ) {
          targetCategories[index].index = targetCategories[index].index - 1;
        }
        category.index = category.index + countNum;
      }
    }
    console.log('✅ Move category DONE');
  }
}

module.exports = CategoryManager;
