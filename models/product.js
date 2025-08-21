const fs = require("fs");
const path = require("path");

const pathUtil = require("../util/path");

const p = path.join(pathUtil, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, productImg, price, description) {
    this.title = title;
    this.productImg = productImg;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      //   Converting the js obj back to json string to store in the file
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.error(err);
      });
    });
  }

  //   using static method to return all products without the need to create a new object from this class.
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
