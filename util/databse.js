const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "express_start",
  port: 3308,
});

module.exports = pool.promise();
