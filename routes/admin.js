const express = require("express");

const productsController = require("../controllers/products");

const router = express.Router();

router.get("/add-product", productsController.addProduct);

router.post("/save-product", productsController.saveProduct);

exports.routes = router;
