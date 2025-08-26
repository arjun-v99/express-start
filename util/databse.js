const Sequelize = require("sequelize");

const sequelize = new Sequelize("express_start", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3308,
});

module.exports = sequelize;
