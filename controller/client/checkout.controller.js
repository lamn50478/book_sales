const Product=require("../../models/product.model")
const ProductCategory=require("../../models/products-category.model");
const productCategoryGetsub=require("../../helpers/product-category-getsub");
const productHelper=require("../../helpers/products");
const Cart=require("../../models/carts.model");
const Order=require("../../models/order.model");


//[GET] /cart :Lay ra cac san pham trong gio
module.exports.index=async (req,res)=>{
    const cartId=req.cookies.cartId;
    const cart=await Cart.findOne({
        _id:cartId
    });
    
    // console.log(cart); 
    if(cart.products.length > 0){
        for(const item of cart.products){
            const productId=item.product_id;
            const productInfor=await Product.findOne({
                _id:productId
            });
            productInfor.priceNew=productHelper.newPriceProduct(productInfor);
            item.productInfor=productInfor;
            item.totalPrice=item.quantity*productInfor.priceNew;
            
        };
         cart.totalPrice=cart.products.reduce((sum,item)=>sum+item.totalPrice,0);
    }


   res.render("client/pages/checkout/index",{
        pageTitle:"Trang giỏ hàng",
        cartDetail:cart,
        
       
      
    })
}
//[POST] /checkout/order : Lay ra thong tin thanh toan (user,product,cart)
module.exports.order=async (req,res)=>{
    const cartId=req.cookies.cartId;
    userInfor=req.body;
    const cart=await Cart.findOne({
        _id:cartId
    });
    let products=[]; //mang chua thong tin cua san pham
    for(const product of cart.products){
        const objectProduct={
            product_id:product.product_id,
            price:0,
            quantity:product.quantity,
            discountPercentage:0

        };
        const productInfor=await Product.findOne({
            _id:product.product_id
        });
        objectProduct.price=productInfor.price;
         objectProduct.discountPercentage=productInfor.discountPercentage;
        products.push(objectProduct); //products:thong tin cua list cac don hang
       
      
    };
    console.log(products);
    const objectOrder={
         
        // user_id:String,
        cartId:cartId,
        userInfor:userInfor
        ,
        products:products
    
    };
    
    const order=new Order(objectOrder);
    await order.save();
    await Cart.updateOne({
        _id:cartId
    },
    {
        products:[]
    }
)


    res.redirect(`/checkout/success/${order.id}`);
}
//[GET] /checkout/success/:orderId : thanh cong
module.exports.success=async (req,res)=>{
    
     const orderId=req.params.orderId;
     const order=await Order.findOne({
        _id:orderId
     });
     
     let products=[];
     for(const product of order.products){
         const productInfor=await Product.findOne({
            _id:product.product_id
         }).select("title thumbnail");
         product.productInfor=productInfor;
         product.priceNew=productHelper.newPriceProduct(product);
         product.totalPrice=product.priceNew*product.quantity;


     };
     order.totalPrices=order.products.reduce((sum,item)=>sum+item.totalPrice,0);
     console.log(order);
     res.render("client/pages/checkout/success",{
        pageTitle:"Trang thanh toán hoàn tất",
        order:order
        
       
      
    })
};
// // //VNPAY-------------
// // // controller/client/checkout.controller.js
// // const crypto = require('crypto');

// // function pad(n) { return String(n).padStart(2, '0'); }
// // function formatDateYYYYMMDDHHmmss(d) {
// //   return d.getFullYear().toString()
// //     + pad(d.getMonth() + 1)
// //     + pad(d.getDate())
// //     + pad(d.getHours())
// //     + pad(d.getMinutes())
// //     + pad(d.getSeconds());
// // }
// // function sortObjectKeys(obj) {
// //   const sorted = {};
// //   Object.keys(obj).sort().forEach(k => { sorted[k] = obj[k]; });
// //   return sorted;
// // }

// // module.exports.create_qr = async (req, res) => {
// //   try {
// //     const vnp_TmnCode = process.env.VNPAY_TMN_CODE || '1KYU5BVC';
// //     const vnp_HashSecret = process.env.VNPAY_HASH_SECRET || '3Y57Q2V6LF9VOQGW0LKF288U2F088OER';
// //     const vnp_Url = process.env.VNPAY_API_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
// //     const vnp_ReturnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/api/check-payment-vnpay';

// //     if (!vnp_TmnCode || !vnp_HashSecret) {
// //       return res.status(500).json({ success: false, message: 'VNPay config missing' });
// //     }

// //     const { cartId, amount, orderInfo, orderType, locale } = req.body || {};
// //     if (!cartId || !amount) {
// //       return res.status(400).json({ success: false, message: 'Missing cartId or amount' });
// //     }

// //     const ipAddr = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';
// //     const now = new Date();
// //     const expire = new Date(now.getTime() + 24 * 60 * 60 * 1000);

// //     const vnpAmount = Math.round(Number(amount) * 100);

// //     const vnpParams = {
// //       vnp_Version: '2.1.0',
// //       vnp_Command: 'pay',
// //       vnp_TmnCode,
// //       vnp_Locale: (locale && String(locale).toLowerCase() === 'en') ? 'en' : 'vn',
// //       vnp_CurrCode: 'VND',
// //       vnp_TxnRef: String(cartId),
// //       vnp_OrderInfo: orderInfo ? String(orderInfo) : `Thanh toán đơn ${cartId}`,
// //       vnp_OrderType: orderType ? String(orderType) : 'other',
// //       vnp_Amount: String(vnpAmount),
// //       vnp_ReturnUrl,
// //       vnp_IpAddr: ipAddr,
// //       vnp_CreateDate: formatDateYYYYMMDDHHmmss(now),
// //       vnp_ExpireDate: formatDateYYYYMMDDHHmmss(expire)
// //     };

// //     const sorted = sortObjectKeys(vnpParams);
// //     const signData = Object.keys(sorted).map(k => `${k}=${sorted[k]}`).join('&');

// //     const hmac = crypto.createHmac('sha512', vnp_HashSecret);
// //     const vnp_SecureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

// //     const query = Object.keys(sorted)
// //       .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(sorted[k])}`)
// //       .join('&');

// //     const paymentUrl = `${vnp_Url}?${query}&vnp_SecureHash=${vnp_SecureHash}`;

// //     return res.json({
// //       success: true,
// //       paymentUrl,
// //       vnp_TxnRef: vnpParams.vnp_TxnRef,
// //       amount: Number(amount)
// //     });
// //   } catch (err) {
// //     console.error('create_qr error:', err);
// //     return res.status(500).json({ success: false, message: 'Server error', error: err.message });
// //   }
// // };


// //--------------------------
// // const crypto = require('crypto');
// // const Product = require("../../models/product.model");
// // const ProductCategory = require("../../models/products-category.model");
// // const productCategoryGetsub = require("../../helpers/product-category-getsub");
// // const productHelper = require("../../helpers/products");
// // const Cart = require("../../models/carts.model");
// // const Order = require("../../models/order.model");

// // // ─── VNPay config ────────────────────────────────────────────────────────────
// // const VNPAY_CONFIG = {
// //   tmnCode:    process.env.VNPAY_TMN_CODE    || '1KYU5BVC',
// //   hashSecret: process.env.VNPAY_HASH_SECRET || '3Y57Q2V6LF9VOQGW0LKF288U2F088OER',
// //   url:        process.env.VNPAY_API_URL     || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
// //   returnUrl:  process.env.VNPAY_RETURN_URL  || 'http://localhost:3000/checkout/vnpay-return',
// // };

// // // ─── Helpers ─────────────────────────────────────────────────────────────────
// // function pad(n) { return String(n).padStart(2, '0'); }

// // function formatDate(d) {
// //   return d.getFullYear()
// //     + pad(d.getMonth() + 1)
// //     + pad(d.getDate())
// //     + pad(d.getHours())
// //     + pad(d.getMinutes())
// //     + pad(d.getSeconds());
// // }

// // function sortObjectKeys(obj) {
// //   const sorted = {};
// //   Object.keys(obj).sort().forEach(k => { sorted[k] = obj[k]; });
// //   return sorted;
// // }

// // function getClientIp(req) {
// //   return (
// //     req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
// //     req.connection?.remoteAddress ||
// //     req.socket?.remoteAddress ||
// //     '127.0.0.1'
// //   );
// // }

// // /**
// //  * Tạo VNPay payment URL
// //  * @param {string} txnRef   - Mã tham chiếu (orderId)
// //  * @param {number} amount   - Số tiền (VND, chưa nhân 100)
// //  * @param {string} orderInfo
// //  * @param {string} ipAddr
// //  * @returns {string} paymentUrl
// //  */
// // function buildVnpayUrl(txnRef, amount, orderInfo, ipAddr) {
// //   const now    = new Date();
// //   const expire = new Date(now.getTime() + 24 * 60 * 60 * 1000);

// //   const params = {
// //     vnp_Version:   '2.1.0',
// //     vnp_Command:   'pay',
// //     vnp_TmnCode:   VNPAY_CONFIG.tmnCode,
// //     vnp_Locale:    'vn',
// //     vnp_CurrCode:  'VND',
// //     vnp_TxnRef:    String(txnRef),
// //     vnp_OrderInfo: orderInfo || `Thanh toan don hang ${txnRef}`,
// //     vnp_OrderType: 'other',
// //     vnp_Amount:    String(Math.round(amount * 100)),
// //     vnp_ReturnUrl: VNPAY_CONFIG.returnUrl,
// //     vnp_IpAddr:    ipAddr,
// //     vnp_CreateDate: formatDate(now),
// //     vnp_ExpireDate: formatDate(expire),
// //   };

// //   const sorted   = sortObjectKeys(params);
// //   const signData = Object.keys(sorted).map(k => `${k}=${sorted[k]}`).join('&');
// //   const hash     = crypto.createHmac('sha512', VNPAY_CONFIG.hashSecret)
// //                          .update(Buffer.from(signData, 'utf-8'))
// //                          .digest('hex');

// //   const query = Object.keys(sorted)
// //     .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(sorted[k])}`)
// //     .join('&');

// //   return `${VNPAY_CONFIG.url}?${query}&vnp_SecureHash=${hash}`;
// // }

// // /**
// //  * Xác minh chữ ký VNPay trả về
// //  * @param {object} query - req.query
// //  * @returns {{ valid: boolean, responseCode: string }}
// //  */
// // function verifyVnpayReturn(query) {
// //   const params       = { ...query };
// //   const secureHash   = params['vnp_SecureHash'];
// //   const responseCode = params['vnp_ResponseCode'];

// //   delete params['vnp_SecureHash'];
// //   delete params['vnp_SecureHashType'];

// //   const sorted   = sortObjectKeys(params);
// //   const signData = Object.keys(sorted).map(k => `${k}=${sorted[k]}`).join('&');
// //   const checkHash = crypto.createHmac('sha512', VNPAY_CONFIG.hashSecret)
// //                           .update(Buffer.from(signData, 'utf-8'))
// //                           .digest('hex');

// //   return {
// //     valid: checkHash === secureHash,
// //     responseCode,
// //   };
// // }

// // // ─── Controllers ─────────────────────────────────────────────────────────────

// // // [GET] /checkout
// // module.exports.index = async (req, res) => {
// //   const cartId = req.cookies.cartId;
// //   const cart   = await Cart.findOne({ _id: cartId });

// //   if (cart.products.length > 0) {
// //     for (const item of cart.products) {
// //       const productInfor = await Product.findOne({ _id: item.product_id });
// //       productInfor.priceNew = productHelper.newPriceProduct(productInfor);
// //       item.productInfor     = productInfor;
// //       item.totalPrice       = item.quantity * productInfor.priceNew;
// //     }
// //     cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
// //   }

// //   res.render("client/pages/checkout/index", {
// //     pageTitle: "Trang giỏ hàng",
// //     cartDetail: cart,
// //   });
// // };

// // // [POST] /checkout/order  →  lưu đơn → redirect sang VNPay
// // module.exports.order = async (req, res) => {
// //   try {
// //     const cartId  = req.cookies.cartId;
// //     const userInfor = req.body;

// //     const cart = await Cart.findOne({ _id: cartId });
// //     if (!cart || cart.products.length === 0) {
// //       return res.redirect('/cart');
// //     }

// //     // Gom sản phẩm + tính tổng tiền
// //     let products    = [];
// //     let totalAmount = 0;

// //     for (const item of cart.products) {
// //       const productInfor = await Product.findOne({ _id: item.product_id });
// //       const price              = productInfor.price;
// //       const discountPercentage = productInfor.discountPercentage || 0;
// //       const priceNew           = price * (1 - discountPercentage / 100);
// //       const lineTotal          = priceNew * item.quantity;

// //       products.push({
// //         product_id:         item.product_id,
// //         price,
// //         quantity:           item.quantity,
// //         discountPercentage,
// //       });

// //       totalAmount += lineTotal;
// //     }

// //     // Lưu đơn hàng
// //     const order = new Order({ cartId, userInfor, products });
// //     await order.save();

// //     // Xoá giỏ hàng
// //     await Cart.updateOne({ _id: cartId }, { products: [] });

// //     // Tạo link VNPay và redirect
// //     const ipAddr     = getClientIp(req);
// //     const orderInfo  = `Thanh toan don hang ${order._id}`;
// //     const paymentUrl = buildVnpayUrl(String(order._id), totalAmount, orderInfo, ipAddr);

// //     res.redirect(paymentUrl);
// //   } catch (err) {
// //     console.error('[checkout.order]', err);
// //     res.status(500).send('Lỗi khi tạo đơn hàng');
// //   }
// // };

// // // [GET] /checkout/vnpay-return  ← VNPay redirect về sau khi thanh toán
// // module.exports.vnpayReturn = async (req, res) => {
// //   try {
// //     const { valid, responseCode } = verifyVnpayReturn(req.query);

// //     if (!valid) {
// //       console.warn('[vnpayReturn] Chữ ký không hợp lệ');
// //       return res.redirect('/checkout/payment-failed?reason=invalid_signature');
// //     }

// //     const orderId = req.query['vnp_TxnRef']; // chính là order._id

// //     if (responseCode === '00') {
// //       // Thanh toán thành công
// //       return res.redirect(`/checkout/success/${orderId}`);
// //     } else {
// //       // Thanh toán thất bại / bị huỷ
// //       console.warn(`[vnpayReturn] Thất bại - responseCode: ${responseCode}`);
// //       return res.redirect(`/checkout/payment-failed?code=${responseCode}&orderId=${orderId}`);
// //     }
// //   } catch (err) {
// //     console.error('[vnpayReturn]', err);
// //     res.status(500).send('Lỗi xử lý kết quả thanh toán');
// //   }
// // };

// // // [GET] /checkout/success/:orderId
// // module.exports.success = async (req, res) => {
// //   try {
// //     const orderId = req.params.orderId;
// //     const order   = await Order.findOne({ _id: orderId });

// //     for (const product of order.products) {
// //       const productInfor = await Product.findOne({ _id: product.product_id })
// //                                         .select("title thumbnail");
// //       product.productInfor = productInfor;
// //       product.priceNew     = productHelper.newPriceProduct(product);
// //       product.totalPrice   = product.priceNew * product.quantity;
// //     }

// //     order.totalPrices = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

// //     res.render("client/pages/checkout/success", {
// //       pageTitle: "Thanh toán hoàn tất",
// //       order,
// //     });
// //   } catch (err) {
// //     console.error('[checkout.success]', err);
// //     res.status(500).send('Lỗi tải trang thành công');
// //   }
// // };

// // // [GET] /checkout/payment-failed
// // module.exports.paymentFailed = (req, res) => {
// //   const code    = req.query.code    || 'unknown';
// //   const orderId = req.query.orderId || '';
// //   const reason  = req.query.reason  || '';

// //   res.render("client/pages/checkout/failed", {
// //     pageTitle: "Thanh toán thất bại",
// //     code,
// //     orderId,
// //     reason,
// //   });
// // };

// // // [POST] /checkout/create_qr  (giữ nguyên cho trường hợp dùng AJAX)
// // module.exports.create_qr = async (req, res) => {
// //   try {
// //     const { cartId, amount, orderInfo, locale } = req.body || {};
// //     if (!cartId || !amount) {
// //       return res.status(400).json({ success: false, message: 'Thiếu cartId hoặc amount' });
// //     }

// //     const ipAddr     = getClientIp(req);
// //     const paymentUrl = buildVnpayUrl(cartId, Number(amount), orderInfo, ipAddr);

// //     return res.json({
// //       success: true,
// //       paymentUrl,
// //       vnp_TxnRef: String(cartId),
// //       amount: Number(amount),
// //     });
// //   } catch (err) {
// //     console.error('[create_qr]', err);
// //     return res.status(500).json({ success: false, message: 'Server error', error: err.message });
// //   }
// // };

// /**
//  * Controller: checkout (VNPay integration)
//  * - Yêu cầu: sử dụng biến môi trường cho TMN/SECRET, chuẩn hóa IP, trim values,
//  *   tạo signData đúng spec (no URL-encode), thêm vnp_SecureHashType vào query,
//  *   kiểm tra hash trước khi redirect, endpoint debug trả signData+hash.
//  *
//  * Lưu ý: BẮT BUỘC set các biến môi trường:
//  *   VNPAY_TMN_CODE, VNPAY_HASH_SECRET, VNPAY_API_URL (optional), VNPAY_RETURN_URL (optional)
//  */
// /**
//  * Controller: checkout (VNPay integration)
//  * - Phiên bản: sửa lỗi returnUrl và xử lý redirect VNPay nối sai (append '&' mà không có '?')
//  * - Cải tiến:
//  *   + Tự động thêm '?' vào vnp_ReturnUrl khi build URL để VNPay append query đúng
//  *   + Nếu VNPay redirect về dạng /checkout/vnpay-return&... (không có '?'), controller sẽ tách phần sau '&' thành query và xử lý bình thường
//  *   + Giữ logging verbose và ghi file debug (không ghi secret)
//  *
//  * BẮT BUỘC: set các biến môi trường VNPAY_TMN_CODE và VNPAY_HASH_SECRET
//  */

// const fs = require('fs');
// const path = require('path');
// const os = require('os');
// const crypto = require('crypto');
// const Product = require("../../models/product.model");
// const productHelper = require("../../helpers/products");
// const Cart = require("../../models/carts.model");
// const Order = require("../../models/order.model");
// const querystring = require('querystring');

// // ─── VNPay config (bắt buộc dùng env) ────────────────────────────────────────
// if (!process.env.VNPAY_TMN_CODE || !process.env.VNPAY_HASH_SECRET) {
//   console.error('[startup] WARNING: Missing VNPAY_TMN_CODE or VNPAY_HASH_SECRET environment variables.');
// }
// const VNPAY_CONFIG = {
//   tmnCode:    process.env.VNPAY_TMN_CODE,
//   hashSecret: process.env.VNPAY_HASH_SECRET,
//   url:        process.env.VNPAY_API_URL     || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
//   returnUrl:  process.env.VNPAY_RETURN_URL  || 'http://localhost:3000/checkout/vnpay-return',
// };

// // ─── Helpers ─────────────────────────────────────────────────────────────────
// function pad(n) { return String(n).padStart(2, '0'); }

// function formatDate(d) {
//   return d.getFullYear()
//     + pad(d.getMonth() + 1)
//     + pad(d.getDate())
//     + pad(d.getHours())
//     + pad(d.getMinutes())
//     + pad(d.getSeconds());
// }

// function sortObjectKeys(obj) {
//   const sorted = {};
//   Object.keys(obj).sort().forEach(k => { sorted[k] = obj[k]; });
//   return sorted;
// }

// function normalizeIp(raw) {
//   if (!raw) return '127.0.0.1';
//   if (raw === '::1' || raw === '::ffff:127.0.0.1') return '127.0.0.1';
//   if (raw.includes(',')) return raw.split(',')[0].trim();
//   return raw;
// }

// function getClientIp(req) {
//   const raw = (
//     req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
//     req.connection?.remoteAddress ||
//     req.socket?.remoteAddress ||
//     req.ip ||
//     '127.0.0.1'
//   );
//   return normalizeIp(raw);
// }

// /**
//  * Ghi file debug an toàn
//  */
// function writeDebugFile(prefix, data) {
//   try {
//     const tmpDir = os.tmpdir();
//     if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
//     const filename = `${prefix}-${Date.now()}.json`;
//     const filepath = path.join(tmpDir, filename);
//     const safeData = JSON.parse(JSON.stringify(data));
//     if (safeData.params && safeData.params.vnp_HashSecret) delete safeData.params.vnp_HashSecret;
//     if (safeData.hashSecret) delete safeData.hashSecret;
//     fs.writeFileSync(filepath, JSON.stringify(safeData, null, 2), 'utf8');
//     console.info(`[debug] wrote file: ${filepath}`);
//     return filepath;
//   } catch (err) {
//     console.warn('[debug] failed to write debug file', err);
//     return null;
//   }
// }

// /**
//  * Build signData theo spec VNPay (NO URL-encode, sorted keys, trimmed values)
//  */
// function buildSignData(params) {
//   const sorted = sortObjectKeys(params);
//   return Object.keys(sorted)
//     .map(k => {
//       const v = sorted[k];
//       const safeVal = (v === undefined || v === null) ? '' : String(v).trim();
//       return `${k}=${safeVal}`;
//     })
//     .join('&');
// }

// /**
//  * Compute HMAC SHA512 hex
//  */
// function computeHash(signData, secret) {
//   return crypto.createHmac('sha512', secret)
//                .update(Buffer.from(signData, 'utf-8'))
//                .digest('hex');
// }

// /**
//  * Ensure returnUrl ends with '?' so VNPay appending '&' still produces valid query
//  */
// function normalizeReturnUrlForVnpay(rawReturnUrl) {
//   if (!rawReturnUrl) return rawReturnUrl;
//   // If already contains '?' (with or without query), keep as-is.
//   if (rawReturnUrl.includes('?')) return rawReturnUrl;
//   // Append '?' so VNPay can append &key=value safely
//   return rawReturnUrl.endsWith('?') ? rawReturnUrl : rawReturnUrl + '?';
// }

// /**
//  * Tạo VNPay payment URL
//  * Trả về { url, signData, hash }
//  */
// function buildVnpayUrl(txnRef, amountVnd, orderInfo, ipAddr) {
//   const now = new Date();
//   const expire = new Date(now.getTime() + 24 * 60 * 60 * 1000);

//   const amt = Number(amountVnd) || 0;
//   const vnpAmount = String(Math.round(amt) * 100); // VND * 100

//   // Use normalized returnUrl (with trailing '?') so VNPay append won't break path
//   const returnUrlForVnpay = normalizeReturnUrlForVnpay(VNPAY_CONFIG.returnUrl);

//   const params = {
//     vnp_Version:   '2.1.0',
//     vnp_Command:   'pay',
//     vnp_TmnCode:   VNPAY_CONFIG.tmnCode,
//     vnp_Locale:    'vn',
//     vnp_CurrCode:  'VND',
//     vnp_TxnRef:    String(txnRef),
//     vnp_OrderInfo: (orderInfo || `Thanh toan don hang ${txnRef}`).trim(),
//     vnp_OrderType: 'other',
//     vnp_Amount:    vnpAmount,
//     vnp_ReturnUrl: returnUrlForVnpay,
//     vnp_IpAddr:    normalizeIp(ipAddr || '127.0.0.1'),
//     vnp_CreateDate: formatDate(now),
//     vnp_ExpireDate: formatDate(expire),
//   };

//   const signData = buildSignData(params);
//   const hash = computeHash(signData, VNPAY_CONFIG.hashSecret);

//   const query = Object.keys(sortObjectKeys(params))
//     .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(String(params[k]).trim())}`)
//     .join('&');

//   const secureHashType = 'SHA512';
//   const url = `${VNPAY_CONFIG.url}?${query}&vnp_SecureHashType=${encodeURIComponent(secureHashType)}&vnp_SecureHash=${encodeURIComponent(hash)}`;

//   // Verbose logging (do not print secret)
//   try {
//     console.info('[buildVnpayUrl] txnRef:', params.vnp_TxnRef);
//     console.info('[buildVnpayUrl] vnp_Amount:', params.vnp_Amount);
//     console.info('[buildVnpayUrl] vnp_TmnCode present:', !!VNPAY_CONFIG.tmnCode);
//     console.info('[buildVnpayUrl] VNPAY_HASH_SECRET present:', !!process.env.VNPAY_HASH_SECRET);
//     console.debug('[buildVnpayUrl] signData:', signData);
//     console.debug('[buildVnpayUrl] computed vnp_SecureHash:', hash);
//     console.debug('[buildVnpayUrl] paymentUrl (first 1000 chars):', url.slice(0, 1000));
//   } catch (logErr) {
//     console.warn('[buildVnpayUrl] logging failed', logErr);
//   }

//   writeDebugFile('vnpay-build', { params, signData, hash, url });

//   return { url, signData, hash };
// }

// /**
//  * Verify VNPay return signature
//  */
// function verifyVnpayReturn(query) {
//   const params = { ...query };
//   const secureHash = params['vnp_SecureHash'];
//   const responseCode = params['vnp_ResponseCode'];

//   delete params['vnp_SecureHash'];
//   delete params['vnp_SecureHashType'];

//   const signData = buildSignData(params);
//   const checkHash = computeHash(signData, VNPAY_CONFIG.hashSecret);

//   writeDebugFile('vnpay-verify', { incomingQuery: query, signData, secureHash, checkHash });

//   const valid = (checkHash || '').toLowerCase() === (secureHash || '').toLowerCase();

//   return {
//     valid,
//     responseCode,
//     signData,
//     secureHash,
//     checkHash,
//   };
// }

// // ─── Controllers ─────────────────────────────────────────────────────────────

// // [GET] /checkout
// module.exports.index = async (req, res) => {
//   try {
//     const cartId = req.cookies.cartId;
//     if (!cartId) {
//       return res.render("client/pages/checkout/index", {
//         pageTitle: "Trang giỏ hàng",
//         cartDetail: { products: [], totalPrice: 0 },
//       });
//     }

//     const cart = await Cart.findOne({ _id: cartId });
//     if (!cart) {
//       return res.render("client/pages/checkout/index", {
//         pageTitle: "Trang giỏ hàng",
//         cartDetail: { products: [], totalPrice: 0 },
//       });
//     }

//     if (cart.products && cart.products.length > 0) {
//       for (const item of cart.products) {
//         const productInfor = await Product.findOne({ _id: item.product_id });
//         if (!productInfor) continue;
//         productInfor.priceNew = productHelper.newPriceProduct(productInfor);
//         item.productInfor = productInfor;
//         item.totalPrice = item.quantity * productInfor.priceNew;
//       }
//       cart.totalPrice = cart.products.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
//     } else {
//       cart.totalPrice = 0;
//     }

//     res.render("client/pages/checkout/index", {
//       pageTitle: "Trang giỏ hàng",
//       cartDetail: cart,
//     });
//   } catch (err) {
//     console.error('[checkout.index] exception:', err);
//     writeDebugFile('vnpay-error-checkout-index', { error: String(err), stack: err.stack });
//     res.status(500).send('Lỗi tải trang giỏ hàng');
//   }
// };

// // [POST] /checkout/order  → lưu đơn → redirect sang VNPay (với pre-check hash)
// module.exports.order = async (req, res) => {
//   try {
//     const cartId  = req.cookies.cartId;
//     const userInfor = req.body || {};

//     if (!cartId) {
//       console.warn('[checkout.order] missing cartId cookie');
//       return res.redirect('/cart');
//     }

//     const cart = await Cart.findOne({ _id: cartId });
//     if (!cart || !cart.products || cart.products.length === 0) {
//       console.warn('[checkout.order] cart empty or not found for id:', cartId);
//       return res.redirect('/cart');
//     }

//     // Gom sản phẩm + tính tổng tiền
//     let products    = [];
//     let totalAmount = 0;

//     for (const item of cart.products) {
//       const productInfor = await Product.findOne({ _id: item.product_id });
//       if (!productInfor) {
//         console.warn('[checkout.order] product not found while building order:', item.product_id);
//         continue;
//       }
//       const price              = productInfor.price || 0;
//       const discountPercentage = productInfor.discountPercentage || 0;
//       const priceNew           = price * (1 - discountPercentage / 100);
//       const lineTotal          = priceNew * (item.quantity || 0);

//       products.push({
//         product_id:         item.product_id,
//         price,
//         quantity:           item.quantity,
//         discountPercentage,
//       });

//       totalAmount += lineTotal;
//     }

//     if (products.length === 0) {
//       console.warn('[checkout.order] no valid products to create order for cart:', cartId);
//       return res.redirect('/cart');
//     }

//     // Lưu đơn hàng
//     const order = new Order({ cartId, userInfor, products });
//     await order.save();

//     // Xoá giỏ hàng
//     await Cart.updateOne({ _id: cartId }, { products: [] });

//     // Tạo link VNPay và redirect
//     const ipAddr     = getClientIp(req);
//     const orderInfo  = `Thanh toan don hang ${order._id}`;

//     // Chuẩn hoá amount: làm tròn sang VND nguyên trước khi truyền vào buildVnpayUrl
//     const amountVnd = Math.round(totalAmount); // totalAmount tính theo VND
//     const { url: paymentUrl, signData, hash } = buildVnpayUrl(String(order._id), amountVnd, orderInfo, ipAddr);

//     // Pre-redirect verification: compute hash again and compare
//     const computed = computeHash(signData, VNPAY_CONFIG.hashSecret);
//     console.info('[checkout.order] pre-redirect hash check - computed equals attached?', (computed || '').toLowerCase() === (hash || '').toLowerCase());
//     console.debug('[checkout.order] pre-redirect computed:', computed);
//     console.debug('[checkout.order] pre-redirect attached hash:', hash);
//     console.debug('[checkout.order] pre-redirect signData:', signData);
//     console.info('[checkout.order] env VNPAY_HASH_SECRET present:', !!process.env.VNPAY_HASH_SECRET);

//     if ((computed || '').toLowerCase() !== (hash || '').toLowerCase()) {
//       const dbgPath = writeDebugFile('vnpay-pre-redirect-mismatch', {
//         orderId: String(order._id),
//         signData,
//         computed,
//         hash,
//         envHashSecretPresent: !!process.env.VNPAY_HASH_SECRET,
//         ipAddr,
//         amountVnd,
//         time: new Date().toISOString()
//       });
//       console.error('[checkout.order] vnpay hash mismatch before redirect', { orderId: String(order._id), debugFile: dbgPath });
//       return res.status(500).send('Lỗi tạo chữ ký VNPay (hash mismatch). Kiểm tra log debug.');
//     }

//     writeDebugFile('vnpay-order', { orderId: String(order._id), totalAmount, amountVnd, ipAddr, signData, hash, paymentUrl });

//     console.info('[checkout.order] created order:', order._id, 'totalAmount:', totalAmount);
//     console.info('[checkout.order] redirecting to VNPay URL (first 1000 chars):', paymentUrl.slice(0, 1000));

//     return res.redirect(paymentUrl);
//   } catch (err) {
//     console.error('[checkout.order] exception:', err);
//     writeDebugFile('vnpay-order-exception', { error: String(err), stack: err.stack });
//     return res.status(500).send('Lỗi khi tạo đơn hàng');
//   }
// };

// // [GET] /checkout/vnpay-return  ← VNPay redirect về sau khi thanh toán
// module.exports.vnpayReturn = async (req, res) => {
//   // Handle malformed VNPay redirect where VNPay appends &... directly to path (no '?')
//   try {
//     const original = req.originalUrl || req.url || '';
//     if (original.includes('&') && !original.includes('?')) {
//       // Example: /checkout/vnpay-return&vnp_TmnCode=...&vnp_TxnRef=...
//       const parts = original.split('&');
//       const base = parts.shift(); // '/checkout/vnpay-return'
//       const fakeQuery = parts.join('&'); // 'vnp_TmnCode=...&vnp_TxnRef=...'
//       try {
//         const parsed = querystring.parse(fakeQuery);
//         // Merge parsed into req.query (note: this mutates req.query for downstream)
//         req.query = { ...req.query, ...parsed };
//         console.info('[vnpayReturn] Detected VNPay appended params without ?; merged parsed query:', parsed);
//       } catch (parseErr) {
//         console.warn('[vnpayReturn] Failed to parse appended query from VNPay:', parseErr);
//       }
//     }
//   } catch (err) {
//     console.warn('[vnpayReturn] Pre-parse of malformed URL failed:', err);
//   }

//   console.info('[vnpayReturn] fullUrl:', req.protocol + '://' + req.get('host') + req.originalUrl);
//   try {
//     // Log headers and raw query for full visibility
//     try {
//       console.info('[vnpayReturn] raw url:', req.url);
//       console.info('[vnpayReturn] headers:', JSON.stringify(req.headers, null, 2));
//       console.info('[vnpayReturn] raw query:', JSON.stringify(req.query, null, 2));
//     } catch (logErr) {
//       console.warn('[vnpayReturn] logging incoming request failed:', logErr);
//     }

//     const result = verifyVnpayReturn(req.query);
//     const { valid, responseCode, signData, secureHash, checkHash } = result;

//     console.info('[vnpayReturn] signature valid:', valid);
//     console.debug('[vnpayReturn] signData:', signData);
//     console.debug('[vnpayReturn] secureHash (from VNPay):', secureHash);
//     console.debug('[vnpayReturn] computed checkHash:', checkHash);

//     if (!valid) {
//       const dbgPath = writeDebugFile('vnpay-return-invalid-signature', {
//         time: new Date().toISOString(),
//         headers: req.headers,
//         query: req.query,
//         verify: { valid, responseCode, signData, secureHash, checkHash }
//       });
//       console.warn('[vnpayReturn] invalid signature detected; wrote debug file:', dbgPath);
//       return res.redirect('/checkout/payment-failed?reason=invalid_signature&debug=1');
//     }

//     const orderId = req.query['vnp_TxnRef'];

//     if (responseCode === '00') {
//       console.info(`[vnpayReturn] payment success for order ${orderId}`);
//       try {
//         await Order.updateOne({ _id: orderId }, { $set: { status: 'paid', paidAt: new Date() } });
//         console.info('[vnpayReturn] order status updated to paid for', orderId);
//       } catch (updateErr) {
//         console.error('[vnpayReturn] failed to update order status:', updateErr);
//         writeDebugFile('vnpay-return-update-order-error', { orderId, updateErr: String(updateErr), stack: updateErr.stack });
//       }
//       return res.redirect(`/checkout/success/${orderId}`);
//     } else {
//       console.warn(`[vnpayReturn] payment failed - responseCode: ${responseCode} for order ${orderId}`);
//       writeDebugFile('vnpay-return-failed', { time: new Date().toISOString(), orderId, responseCode, query: req.query });
//       return res.redirect(`/checkout/payment-failed?code=${responseCode}&orderId=${orderId}&debug=1`);
//     }
//   } catch (err) {
//     console.error('[vnpayReturn] exception:', err);
//     const dbgPath = writeDebugFile('vnpay-return-exception', { error: String(err), stack: err.stack, query: req.query, headers: req.headers });
//     console.error('[vnpayReturn] wrote exception debug file:', dbgPath);
//     return res.status(500).send('Lỗi xử lý kết quả thanh toán');
//   }
// };

// // [GET] /checkout/success/:orderId
// module.exports.success = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     if (!orderId) {
//       console.warn('[checkout.success] missing orderId param');
//       return res.status(400).send('Thiếu orderId');
//     }

//     const order = await Order.findOne({ _id: orderId });
//     if (!order) {
//       console.warn('[checkout.success] order not found:', orderId);
//       return res.status(404).send('Đơn hàng không tồn tại');
//     }

//     for (const product of order.products) {
//       const productInfor = await Product.findOne({ _id: product.product_id })
//                                         .select("title thumbnail price discountPercentage");
//       if (!productInfor) {
//         console.warn('[checkout.success] product info missing for id:', product.product_id);
//         product.productInfor = { title: 'Sản phẩm không xác định', thumbnail: '' };
//         product.priceNew = 0;
//         product.totalPrice = 0;
//         continue;
//       }
//       product.productInfor = productInfor;
//       try {
//         product.priceNew     = productHelper.newPriceProduct(productInfor);
//       } catch (phErr) {
//         console.warn('[checkout.success] productHelper.newPriceProduct error for', product.product_id, phErr);
//         product.priceNew = productInfor.price || 0;
//       }
//       product.totalPrice   = product.priceNew * product.quantity;
//     }

//     order.totalPrices = order.products.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

//     res.render("client/pages/checkout/success", {
//       pageTitle: "Thanh toán hoàn tất",
//       order,
//     });
//   } catch (err) {
//     console.error('[checkout.success] exception:', err);
//     writeDebugFile('vnpay-success-exception', { error: String(err), stack: err.stack });
//     res.status(500).send('Lỗi tải trang thành công');
//   }
// };

// // [GET] /checkout/payment-failed
// module.exports.paymentFailed = (req, res) => {
//   try {
//     const code    = req.query.code    || 'unknown';
//     const orderId = req.query.orderId || '';
//     const reason  = req.query.reason  || '';
//     const debug   = req.query.debug   || '';

//     console.info('[paymentFailed] code:', code, 'orderId:', orderId, 'reason:', reason, 'debug:', debug);

//     res.render("client/pages/checkout/failed", {
//       pageTitle: "Thanh toán thất bại",
//       code,
//       orderId,
//       reason,
//       debug,
//     });
//   } catch (err) {
//     console.error('[paymentFailed] exception:', err);
//     writeDebugFile('vnpay-payment-failed-exception', { error: String(err), stack: err.stack });
//     res.status(500).send('Lỗi hiển thị trang thất bại');
//   }
// };

// // [POST] /checkout/create_qr
// module.exports.create_qr = async (req, res) => {
//   try {
//     const { cartId, amount, orderInfo } = req.body || {};
//     if (!cartId || !amount) {
//       console.warn('[create_qr] missing cartId or amount', { cartId, amount });
//       return res.status(400).json({ success: false, message: 'Thiếu cartId hoặc amount' });
//     }

//     const ipAddr     = getClientIp(req);
//     const amountVnd = Math.round(Number(amount) || 0);
//     const { url: paymentUrl, signData, hash } = buildVnpayUrl(cartId, amountVnd, orderInfo, ipAddr);

//     console.info('[create_qr] generated paymentUrl for cartId:', cartId, 'amount:', amount);
//     console.debug('[create_qr] signData:', signData);
//     console.debug('[create_qr] hash:', hash);

//     writeDebugFile('vnpay-create_qr', { cartId, amount, amountVnd, ipAddr, signData, hash, paymentUrl });

//     return res.json({
//       success: true,
//       paymentUrl,
//       vnp_TxnRef: String(cartId),
//       amount: Number(amount),
//     });
//   } catch (err) {
//     console.error('[create_qr] exception:', err);
//     writeDebugFile('vnpay-create_qr-exception', { error: String(err), stack: err.stack });
//     return res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// };

// /**
//  * [GET] /checkout/vnpay-debug
//  * - Debug endpoint: trả về signData và hash cho một txnRef & amount query params
//  * - CHỈ DÙNG TRONG DEV: không expose secret trong production
//  * Example: /checkout/vnpay-debug?txnRef=abc123&amount=10000
//  */
// module.exports.vnpayDebug = (req, res) => {
//   try {
//     const txnRef = req.query.txnRef || `debug-${Date.now()}`;
//     const amount = Number(req.query.amount || 1000);
//     const ipAddr = req.query.ip || '127.0.0.1';
//     const orderInfo = req.query.orderInfo || `Debug thanh toan ${txnRef}`;

//     const { url, signData, hash } = buildVnpayUrl(txnRef, amount, orderInfo, ipAddr);

//     return res.json({ success: true, txnRef, amount, signData, hash, url });
//   } catch (err) {
//     console.error('[vnpayDebug] exception:', err);
//     writeDebugFile('vnpay-debug-exception', { error: String(err), stack: err.stack });
//     return res.status(500).json({ success: false, message: 'Debug error', error: err.message });
//   }
// };

