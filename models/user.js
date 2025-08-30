const Sequelize = require("sequelize");

const sequelize = require("../util/databse");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: { type: Sequelize.STRING, allowNull: false },
  email: {
    unique: true,
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },
});

module.exports = User;
