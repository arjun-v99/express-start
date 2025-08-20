// creating a global array to store incoming products
const products = [];

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    products.push(this);
  }

  //   using static method to return all products without the need to create a new object from this class.
  static fetchAll() {
    return products;
  }
};
