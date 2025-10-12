const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/add-product", authMiddleware, adminController.addProduct);

router.post(
  "/save-product",
  [
    body("title")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Title must be atleast 2 charecters"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isFloat()
      .withMessage("please enter a number with 2 decimal places"),
    body("productImg")
      .trim()
      .notEmpty()
      .withMessage("URL for image is required"),
    body("description")
      .trim()
      .isLength({ max: 400 })
      .withMessage("Please do not enter more than 400 charecters"),
  ],
  authMiddleware,

  adminController.saveProduct
);

router.get("/products", authMiddleware, adminController.listProductsForAdmin);

router.get(
  "/edit-product/:productId",
  authMiddleware,
  adminController.getEditProduct
);

router.post(
  "/edit-product",
  authMiddleware,
  [
    body("title")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Title must be atleast 2 charecters"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isFloat()
      .withMessage("Please enter a number with 2 decimal places"),
    body("productImg")
      .trim()
      .notEmpty()
      .withMessage("URL for image is required"),
    body("description")
      .trim()
      .isLength({ max: 400 })
      .withMessage("Please do not enter more than 400 charecters"),
  ],
  adminController.postEditProduct
);

router.post(
  "/delete-product",
  authMiddleware,
  adminController.postDeleteProduct
);

exports.routes = router;
