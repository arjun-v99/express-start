const Sequelize = require("sequelize");

const sequelize = require("../util/databse");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: Sequelize.STRING,
  price: {
    allowNull: false,
    type: Sequelize.DOUBLE,
  },
  imageUrl: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
  },
});

module.exports = Product;
