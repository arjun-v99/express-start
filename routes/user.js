const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("<h1>Home Page</h1>");
});

exports.router = router;
