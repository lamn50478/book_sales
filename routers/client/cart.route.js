
const express = require('express');
const router = express.Router();
const controller = require('../../controller/client/cart.controller');


//[GET] /cart
router.get("/",controller.cart);
//[GET] /cart/delete/:id

router.get("/delete/:productId",controller.cartDelete);

//[GET] /cart/update/:productId/quantityd

router.get("/update/:productId/:quantity",controller.cartUpdate);
//[POST] /cart/add/product:id
router.post("/add/:productId",controller.addPost);

module.exports = router;