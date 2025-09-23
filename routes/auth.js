const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.doLogin);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.signUp);

router.post("/logout", authController.doLogout);

router.get("/reset-password", authController.getResetPwd);

router.post("/reset-password", authController.postResetPwd);

router.get("/reset-password/:token", authController.setNewPassword);

router.post("/update-new-password", authController.postUpdateNewPwd);

exports.routes = router;
