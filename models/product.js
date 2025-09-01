const getDb = require("../util/databse").getDb;

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then()
      .catch((err) => {
        console.error(err);
      });
  }
}

module.exports = Product;
