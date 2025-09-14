const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);

// // Importing ObjectId from mongo
// const { ObjectId } = require("mongodb");

// const getDb = require("../util/databse").getDb;

// class Product {
//   constructor(title, price, imageUrl, description, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.id = id ? ObjectId.createFromHexString(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this.id) {
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this.id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp.then().catch((err) => {
//       console.error(err);
//     });
//   }

//   static fetchAll() {
//     const db = getDb();

//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   }

//   static fetchById(prodId) {
//     const db = getDb();

//     return (
//       db
//         .collection("products")
//         // Converting prodId to ObjectId format.
//         .findOne({ _id: ObjectId.createFromHexString(prodId) })
//         .then((products) => {
//           return products;
//         })
//         .catch((err) => {
//           console.error(err);
//         })
//     );
//   }

//   static deleteById(prodId) {
//     const db = getDb();

//     return db
//       .collection("products")
//       .deleteOne({ _id: ObjectId.createFromHexString(prodId) })
//       .then()
//       .catch((err) => {
//         console.error(err);
//       });
//   }
// }

// module.exports = Product;
