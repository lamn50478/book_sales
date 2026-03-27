
const express = require('express');
const router = express.Router();
const controller = require('../../controller/client/cart.controller');


//[GET] /cart
router.get("/",controller.cart);
//[POST] /cart/add/product:id
router.post("/add/:productId",controller.addPost);

module.exports = router;