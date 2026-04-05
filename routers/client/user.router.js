
const express = require('express');
const router = express.Router();
const controller = require('../../controller/client/user.controller');
const userValidate=require("../../validates/client/user.validate");
const authMiddleware=require("../../middeware/client/auth.middleware");


router.get("/register",controller.register);
router.post("/register",userValidate.registerPost,controller.registerPost);
router.get("/login",controller.login);
router.post("/login",userValidate.loginPost,controller.loginPost);
router.get("/logout",controller.logout);
router.get("/password/forget",controller.forgetPassword);
router.post("/password/forget",userValidate.forgetPassPost,controller.forgetPasswordPost);
router.get("/password/otp",controller.otpPassword);
router.post("/password/otp",controller.otpPasswordPost);
router.get("/password/reset",controller.reset);
router.post("/password/reset",userValidate.confirmPassword,controller.resetPost);

router.get("/infor",authMiddleware.requireAuth,controller.infor);












module.exports = router;
