
const express = require('express');
const router = express.Router();
const controller = require('../../controller/client/checkout.controller');


//[GET] /checkout
router.get("/",controller.index);
//[POST] /checkout/order
router.post("/order",controller.order);

//[GET] /checkout/success/:orderId
router.get("/success/:orderId",controller.success);



module.exports = router;