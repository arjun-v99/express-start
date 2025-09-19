const express = require("express");

const adminController = require("../controllers/admin");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/add-product", authMiddleware, adminController.addProduct);

router.post("/save-product", authMiddleware, adminController.saveProduct);

router.get("/products", authMiddleware, adminController.listProductsForAdmin);

router.get(
  "/edit-product/:productId",
  authMiddleware,
  adminController.getEditProduct
);

router.post("/edit-product", authMiddleware, adminController.postEditProduct);

router.post(
  "/delete-product",
  authMiddleware,
  adminController.postDeleteProduct
);

exports.routes = router;
