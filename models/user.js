// Importing ObjectId from mongo
const { ObjectId } = require("mongodb");

const getDb = require("../util/databse").getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this._id = id;
    this.cart = cart;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this.id) {
      dbOp = db.collection("users").updateOne({ _id: this.id }, { $set: this });
    } else {
      dbOp = db.collection("users").insertOne(this);
    }
    return dbOp.then().catch((err) => {
      console.error(err);
    });
  }

  static findById(userId) {
    const db = getDb();
    return (
      db
        .collection("users")
        // Converting prodId to ObjectId format.
        .findOne({ _id: ObjectId.createFromHexString(userId) })
        .then((users) => {
          return users;
        })
        .catch((err) => {
          console.error(err);
        })
    );
  }

  static countUsers() {
    const db = getDb();

    return db
      .collection("users")
      .countDocuments()
      .then()
      .catch((err) => {
        console.error(err);
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      (cp) => cp.productId.toString() === product._id.toString()
    );
    // creating a copy of cart items
    const updatedCartItems = [...this.cart.items];
    let newQuantity = 1;
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: newQuantity });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db.collection("users").updateOne(
      {
        _id: this._id,
      },
      {
        // this will set the cart object to our user document
        $set: { cart: updatedCart },
      }
    );
  }
}

module.exports = User;
