const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      console.log("Connected");
      _db = client.db("express-start");
      callback(client);
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "Unable to connect to databse";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
