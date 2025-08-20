const path = require("path");

const express = require("express");

const productsController = require("../controllers/products");
const router = express.Router();

router.get("/", productsController.listProducts);

exports.router = router;
