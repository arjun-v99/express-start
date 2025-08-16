const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  // path module is required to get the absolute path according to the OS.
  // __dirname is used to get current directory, like where the script executed
  // ../ is go to go up one level in directory
  // views is our folder and last one is our file name
  // we do it like this because different OS have different way of accessing dirs eg: windows - c:\users\html linux- /usr/bin/lib... etc
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/save-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
