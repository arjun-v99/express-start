const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", adminController.addProduct);

router.post("/save-product", adminController.saveProduct);

router.get("/products", adminController.listProductsForAdmin);

exports.routes = router;
