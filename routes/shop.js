const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getHome);
router.get("/products", shopController.listProducts);
router.get("/products/:productId", shopController.getProductDetail);

router.get("/cart", shopController.getCart);
router.post("/cart", shopController.addToCart);
router.post("/cart-delete-item", shopController.postCartDeleteProduct);

router.get("/orders", shopController.getOrders);
router.post("/create-order", shopController.createOrder);

exports.router = router;
