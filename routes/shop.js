const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getHome);
router.get("/products", shopController.listProducts);
router.get("/products/:productId", shopController.getProductDetail);
router.get("/cart", shopController.getCart);
router.get("/orders", shopController.getOrders);
router.get("/checkout", shopController.getCheckout);

exports.router = router;
