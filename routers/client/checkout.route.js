
const express = require('express');
const router = express.Router();
const controller = require('../../controller/client/checkout.controller');


//[GET] /checkout
router.get("/",controller.index);
//[POST] /checkout/order
router.post("/order",controller.order);
// router.post("/create_qr",controller.create_qr);


//[GET] /checkout/success/:orderId
router.get("/success/:orderId",controller.success);


module.exports = router;

//------------------------------------------
// const express = require('express');
// const router  = express.Router();
// const controller = require('../../controller/client/checkout.controller');

// // [GET]  /checkout              — hiển thị giỏ hàng
// router.get('/', controller.index);

// // [POST] /checkout/order        — lưu đơn → redirect sang VNPay
// router.post('/order', controller.order);

// // [GET]  /checkout/vnpay-return — VNPay redirect về sau khi thanh toán
// //        (phải trùng với VNPAY_RETURN_URL trong config)
// router.get('/vnpay-return', controller.vnpayReturn);

// // [GET]  /checkout/success/:orderId — trang thanh toán thành công
// router.get('/success/:orderId', controller.success);

// // [GET]  /checkout/payment-failed   — trang thanh toán thất bại / bị huỷ
// router.get('/payment-failed', controller.paymentFailed);

// // [POST] /checkout/create_qr    — tạo link VNPay qua AJAX (tuỳ chọn)
// router.post('/create_qr', controller.create_qr);

// module.exports = router;