// Importing ObjectId from mongo
const { name } = require("ejs");
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

  getCart() {
    const db = getDb();
    // Creating an array product Ids
    const productIds = this.cart.items.map((i) => i.productId);

    // with the help of $in operator we are finding all products with the productId inside the array.
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        // Removing cart items if cart items not found in products List
        this.cart.items = this.cart.items.filter((item) =>
          products.some(
            (product) => product._id.toString() === item.productId.toString()
          )
        );
        // Removing cart items from users collection if cart items not found in products List
        const updatedCart = {
          items: this.cart.items,
        };
        db.collection("users").updateOne(
          {
            _id: this._id,
          },
          {
            // this will set the cart object to our user document
            $set: { cart: updatedCart },
          }
        );

        // we need to add the quantity back to the result we got from db.
        return products.map((p) => {
          // returning an obj with all properties of product and finding quantity from the cart items
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      (p) => p.productId.toString() !== productId.toString()
    );
    const db = getDb();
    return db.collection("users").updateOne(
      {
        _id: this._id,
      },
      {
        // this will set the cart object to our user document
        $set: { cart: { items: updatedCartItems } },
      }
    );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        // Storing the products and quantity from the cart
        const order = {
          items: products,
          user: {
            _id: this._id,
            username: this.username,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        // emptying cart instance after placing order
        this.cart = { items: [] };
        // emptying cart in db after placing order
        return db.collection("users").updateOne(
          {
            _id: this._id,
          },
          { $set: { cart: { items: [] } } }
        );
      });
  }

  getOrders() {
    const db = getDb();
    return db.collection("orders").find({ "user._id": this._id }).toArray();
  }
}

module.exports = User;
