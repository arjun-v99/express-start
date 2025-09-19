const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/", shopController.getHome);
router.get("/products", shopController.listProducts);
router.get("/products/:productId", shopController.getProductDetail);

router.get("/cart", authMiddleware, shopController.getCart);
router.post("/cart", authMiddleware, shopController.addToCart);
router.post(
  "/cart-delete-item",
  authMiddleware,
  shopController.postCartDeleteProduct
);

router.get("/orders", authMiddleware, shopController.getOrders);
router.post("/create-order", authMiddleware, shopController.createOrder);

exports.router = router;
