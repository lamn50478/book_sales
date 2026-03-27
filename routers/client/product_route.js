// const express=require('express')
// const router=express.Router()
// const controller=require('../../controller/client/product.controller')

//     router.get('/',controller.product)
//     router.get("/:id",controller.detail);
//     router.get(`/category/:slugCategory`,controller.slugCategory)
//     router.get(`/category/detail/:slugCategory`,controller.detail)

// module.exports=router;
// product_route.js
const express = require('express');
const router = express.Router();
const controller = require('../../controller/client/product.controller');

// Các route theo thứ tự: category cụ thể trước
router.get('/category/detail/:slugCategory', controller.detailSlug); // nếu cần khác behavior
router.get('/category/:slugCategory', controller.slugCategory);

// Route danh sách sản phẩm
router.get('/', controller.product);

// Route chi tiết sản phẩm theo id (đặt sau các route cụ thể)
router.get('/:id', controller.detail);

module.exports = router;
