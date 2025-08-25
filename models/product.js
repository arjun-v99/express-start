const db = require("../util/databse");

const Cart = require("../models/cart");

module.exports = class Product {
  constructor(id, title, productImg, price, description) {
    this.id = id;
    this.title = title;
    this.productImg = productImg;
    this.price = price;
    this.description = description;
  }

  save() {
    // execute returns a Promise so that we can use .then and .catch
    return db.execute(
      "INSERT INTO products (title, image_url, price, description) VALUES (?, ?, ?, ?)",
      [this.title, this.productImg, this.price, this.description]
    );
  }

  //   using static method to return all products without the need to create a new object from this class.
  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static getById(id) {
    return db.execute("SELECT * FROM products WHERE product_id = ?", [id]);
  }

  static deleteById(id) {}
};
