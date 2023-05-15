function* generateID() {
  let id = new Date().getTime();
  while (true) {
    yield id++;
  }
}

const generator = generateID();

class Category {
  constructor(name = '', parent = null, children = null, level = 0, index = 0) {
    this.name = name;
    this.parent = parent;
    this.children = children;
    this.level = level;
    // index within its parent category
    this.index = index;
    this.id = generator.next().value;
  }
}

module.exports = Category;
