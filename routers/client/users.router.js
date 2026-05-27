
const express = require('express');
const router = express.Router();
const controller = require('../../controller/client/users.controller');
const userValidate=require("../../validates/client/user.validate");
const authMiddleware=require("../../middeware/client/auth.middleware");


router.get("/not-friend",controller.notFriend);
router.get("/request",controller.request);
router.get("/accept",controller.accept);







module.exports = router;
