// // [GET] admin-dashboard

// const mongoose = require("mongoose");
// const Product = require('../../models/product.model');
// const filterStatusHelpers = require('../../helpers/fillterStatus');
// const searchHelpers = require('../../helpers/search');
// const paginationHelpers = require('../../helpers/pagination');
// const systemConfig = require("../../config/system.js");
// const validate = require("../../validates/admin/products.validate.js");

// const productCategory = require('../../models/products-category.model');
// const Account = require('../../models/account.model.js');
// const createTreeHelper = require('../../helpers/create-tree.js');
// const User = require('../../models/user.model.js');
// const Orders=require("../../models/order.model.js");

// module.exports.dashboard = async (req, res) => {
//   try {
//     const statistic = {
//       productCategory: { total: 0, active: 0, inactive: 0 },
//       product: { total: 0, active: 0, inactive: 0 },
//       account: { total: 0, active: 0, inactive: 0 },
//       user: { total: 0, active: 0, inactive: 0 },
//     };

//     // Chạy các truy vấn đếm song song để tăng hiệu năng
//     const [
//       pcTotal, pcActive, pcInactive,
//       pTotal, pActive, pInactive,
//       aTotal, aActive, aInactive,
//       uTotal, uActive, uInactive
//     ] = await Promise.all([
//       // productCategory
//       productCategory.countDocuments({ deleted: false }),
//       productCategory.countDocuments({ deleted: false, status: "active" }),
//       productCategory.countDocuments({ deleted: false, status: "inactive" }),

//       // product
//       Product.countDocuments({ deleted: false }),
//       Product.countDocuments({ deleted: false, status: "active" }),
//       Product.countDocuments({ deleted: false, status: "inactive" }),

//       // account
//       Account.countDocuments({ deleted: false }),
//       Account.countDocuments({ deleted: false, status: "active" }),
//       Account.countDocuments({ deleted: false, status: "inactive" }),

//       // user
//       User.countDocuments({ deleted: false }),
//       User.countDocuments({ deleted: false, status: "active" }),
//       User.countDocuments({ deleted: false, status: "inactive" }),
//     ]);

//     // Gán kết quả vào object statistic
//     statistic.productCategory.total = pcTotal;
//     statistic.productCategory.active = pcActive;
//     statistic.productCategory.inactive = pcInactive;

//     statistic.product.total = pTotal;
//     statistic.product.active = pActive;
//     statistic.product.inactive = pInactive;

//     statistic.account.total = aTotal;
//     statistic.account.active = aActive;
//     statistic.account.inactive = aInactive;

//     statistic.user.total = uTotal;
//     statistic.user.active = uActive;
//     statistic.user.inactive = uInactive;

    

//     // Render view với statistic
//     res.render("admin/pages/dashboard/index.pug", {
//       pageTitle: "Trang tổng quan",
//       statistic: statistic
//     });
//   } catch (err) {
//     console.error("Dashboard error:", err);
//     res.status(500).send("Lỗi server");
//   }
// };
// [GET] admin-dashboard


//----------------------------------------------------------------lan2

// const mongoose = require("mongoose");
// const Product = require('../../models/product.model');
// const filterStatusHelpers = require('../../helpers/fillterStatus');
// const searchHelpers = require('../../helpers/search');
// const paginationHelpers = require('../../helpers/pagination');
// const systemConfig = require("../../config/system.js");
// const validate = require("../../validates/admin/products.validate.js");

// const productCategory = require('../../models/products-category.model');
// const Account = require('../../models/account.model.js');
// const createTreeHelper = require('../../helpers/create-tree.js');
// const User = require('../../models/user.model.js');
// const Orders = require("../../models/order.model.js");

// module.exports.dashboard = async (req, res) => {
//   try {
//     const statistic = {
//       productCategory: { total: 0, active: 0, inactive: 0 },
//       product: { total: 0, active: 0, inactive: 0 },
//       account: { total: 0, active: 0, inactive: 0 },
//       user: { total: 0, active: 0, inactive: 0 },
//     };

//     // Chạy các truy vấn đếm song song để tăng hiệu năng
//     const [
//       pcTotal, pcActive, pcInactive,
//       pTotal, pActive, pInactive,
//       aTotal, aActive, aInactive,
//       uTotal, uActive, uInactive
//     ] = await Promise.all([
//       // productCategory
//       productCategory.countDocuments({ deleted: false }),
//       productCategory.countDocuments({ deleted: false, status: "active" }),
//       productCategory.countDocuments({ deleted: false, status: "inactive" }),

//       // product
//       Product.countDocuments({ deleted: false }),
//       Product.countDocuments({ deleted: false, status: "active" }),
//       Product.countDocuments({ deleted: false, status: "inactive" }),

//       // account
//       Account.countDocuments({ deleted: false }),
//       Account.countDocuments({ deleted: false, status: "active" }),
//       Account.countDocuments({ deleted: false, status: "inactive" }),

//       // user
//       User.countDocuments({ deleted: false }),
//       User.countDocuments({ deleted: false, status: "active" }),
//       User.countDocuments({ deleted: false, status: "inactive" }),
//     ]);

//     // Gán kết quả vào object statistic
//     statistic.productCategory.total = pcTotal;
//     statistic.productCategory.active = pcActive;
//     statistic.productCategory.inactive = pcInactive;

//     statistic.product.total = pTotal;
//     statistic.product.active = pActive;
//     statistic.product.inactive = pInactive;

//     statistic.account.total = aTotal;
//     statistic.account.active = aActive;
//     statistic.account.inactive = aInactive;

//     statistic.user.total = uTotal;
//     statistic.user.active = uActive;
//     statistic.user.inactive = uInactive;

//     // ----------------------------
//     // Lấy thông tin mua hàng theo user để hiển thị dưới dashboard
//     // Kết quả: purchases = [
//     //   {
//     //     userKey: '...', // dùng để phân biệt (userId hoặc phone)
//     //     userInfor: { fullName, phone, address, userId? },
//     //     items: [{ productId, title, quantity, price, discountPercentage, lineTotal }],
//     //     totalQuantity,
//     //     totalSpent
//     //   }, ...
//     // ]
//     // ----------------------------

//     // Lấy các đơn hàng gần nhất (giới hạn để tránh truy vấn quá lớn)
//     const orders = await Orders.find({})
//       .sort({ createdAt: -1 })
//       .limit(200)
//       .lean();

//     // Thu thập tất cả product_id xuất hiện trong orders để truy vấn 1 lần
//     const productIdSet = new Set();
//     orders.forEach(o => {
//       if (Array.isArray(o.products)) {
//         o.products.forEach(p => {
//           if (p && p.product_id) productIdSet.add(String(p.product_id));
//         });
//       }
//     });
//     const productIds = Array.from(productIdSet);

//     // Tìm tất cả product docs liên quan
//     const productsDocs = await Product.find({ _id: { $in: productIds.map(id => {
//       // nếu id là ObjectId string thì convert, nếu không hợp lệ thì giữ nguyên
//       try { return mongoose.Types.ObjectId(id); } catch (e) { return id; }
//     }) } }).lean();

//     const productMap = {};
//     productsDocs.forEach(pd => {
//       productMap[String(pd._id)] = pd;
//     });

//     // Gom orders theo user (ưu tiên userId nếu có, nếu không dùng userInfor.phone)
//     const purchasesMap = new Map();

//     for (const order of orders) {
//       // Xác định key user
//       const userId = order.userId ? String(order.userId) : null;
//       const userInfor = order.userInfor || {};
//       const userKey = userId || (userInfor.phone ? `phone:${userInfor.phone}` : `order:${order._id}`);

//       if (!purchasesMap.has(userKey)) {
//         purchasesMap.set(userKey, {
//           userKey,
//           userInfor: {
//             fullName: userInfor.fullName || (userId ? undefined : 'Khách hàng'),
//             phone: userInfor.phone || undefined,
//             address: userInfor.address || undefined,
//             userId: userId || undefined
//           },
//           items: [],
//           totalQuantity: 0,
//           totalSpent: 0
//         });
//       }

//       const entry = purchasesMap.get(userKey);

//       if (Array.isArray(order.products)) {
//         for (const p of order.products) {
//           const pid = String(p.product_id);
//           const productDoc = productMap[pid];
//           const title = productDoc ? (productDoc.title || 'Sản phẩm') : (p.title || 'Sản phẩm');
//           const quantity = Number(p.quantity || 0);
//           const price = Number(p.price || 0);
//           const discountPercentage = Number(p.discountPercentage || 0);

//           // Tính line total theo đơn hàng: áp dụng discountPercentage nếu có
//           const discountFactor = (100 - discountPercentage) / 100;
//           const lineTotal = +(price * quantity * discountFactor).toFixed(2);

//           entry.items.push({
//             productId: pid,
//             title,
//             quantity,
//             price,
//             discountPercentage,
//             lineTotal,
//             orderId: String(order._id),
//             orderedAt: order.createdAt
//           });

//           entry.totalQuantity += quantity;
//           entry.totalSpent = +(entry.totalSpent + lineTotal).toFixed(2);
//         }
//       }
//     }

//     // Chuyển map thành mảng, sắp xếp theo totalSpent giảm dần
//     const purchases = Array.from(purchasesMap.values())
//       .sort((a, b) => b.totalSpent - a.totalSpent);

//     // Render view với statistic và purchases
//     res.render("admin/pages/dashboard/index.pug", {
//       pageTitle: "Trang tổng quan",
//       statistic: statistic,
//       purchases // truyền xuống view để in ra
//     });
//   } catch (err) {
//     console.error("Dashboard error:", err);
//     res.status(500).send("Lỗi server");
//   }
// };

// [GET] admin-dashboard
const mongoose = require("mongoose");
const Product = require('../../models/product.model');
const filterStatusHelpers = require('../../helpers/fillterStatus');
const searchHelpers = require('../../helpers/search');
const paginationHelpers = require('../../helpers/pagination');
const systemConfig = require("../../config/system.js");
const validate = require("../../validates/admin/products.validate.js");

const productCategory = require('../../models/products-category.model');
const Account = require('../../models/account.model.js');
const createTreeHelper = require('../../helpers/create-tree.js');
const User = require('../../models/user.model.js');
const Orders = require("../../models/order.model.js");

module.exports.dashboard = async (req, res) => {
  try {
    const statistic = {
      productCategory: { total: 0, active: 0, inactive: 0 },
      product: { total: 0, active: 0, inactive: 0 },
      account: { total: 0, active: 0, inactive: 0 },
      user: { total: 0, active: 0, inactive: 0 },
    };

    // Chạy các truy vấn đếm song song để tăng hiệu năng
    const [
      pcTotal, pcActive, pcInactive,
      pTotal, pActive, pInactive,
      aTotal, aActive, aInactive,
      uTotal, uActive, uInactive
    ] = await Promise.all([
      productCategory.countDocuments({ deleted: false }),
      productCategory.countDocuments({ deleted: false, status: "active" }),
      productCategory.countDocuments({ deleted: false, status: "inactive" }),

      Product.countDocuments({ deleted: false }),
      Product.countDocuments({ deleted: false, status: "active" }),
      Product.countDocuments({ deleted: false, status: "inactive" }),

      Account.countDocuments({ deleted: false }),
      Account.countDocuments({ deleted: false, status: "active" }),
      Account.countDocuments({ deleted: false, status: "inactive" }),

      User.countDocuments({ deleted: false }),
      User.countDocuments({ deleted: false, status: "active" }),
      User.countDocuments({ deleted: false, status: "inactive" }),
    ]);

    statistic.productCategory.total   = pcTotal;
    statistic.productCategory.active   = pcActive;
    statistic.productCategory.inactive = pcInactive;

    statistic.product.total   = pTotal;
    statistic.product.active   = pActive;
    statistic.product.inactive = pInactive;

    statistic.account.total   = aTotal;
    statistic.account.active   = aActive;
    statistic.account.inactive = aInactive;

    statistic.user.total   = uTotal;
    statistic.user.active   = uActive;
    statistic.user.inactive = uInactive;

    // ── Lấy đơn hàng ──────────────────────────────────────────────
    const orders = await Orders.find({}).sort({ createdAt: -1 }).lean();

    // Thu thập tất cả product_id để query 1 lần
    const productIdSet = new Set();
    orders.forEach(o =>
      (o.products || []).forEach(p => {
        const id = p?.product_id;
        if (id) productIdSet.add(String(id));
      })
    );

    // Lấy tên sản phẩm từ DB
    const productDocs = productIdSet.size
      ? await Product.find({
          _id: {
            $in: [...productIdSet].map(id => {
              try { return mongoose.Types.ObjectId(id); } catch { return id; }
            })
          }
        }).lean()
      : [];

    const productMap = {};
    productDocs.forEach(p => {
      productMap[String(p._id)] = p.title || 'Sản phẩm';
    });

    // ── Gom đơn hàng theo người dùng (key = phone) ─────────────────
    const purchasesMap = new Map();

    for (const order of orders) {
      const info = order.userInfor || {};
      const key  = info.phone
        ? String(info.phone)
        : `order:${String(order._id)}`;

      if (!purchasesMap.has(key)) {
        purchasesMap.set(key, {
          fullName:   info.fullName || 'Khách hàng',
          phone:      info.phone    || '—',
          address:    info.address  || '—',
          items:      [],
          totalSpent: 0
        });
      }

      const entry = purchasesMap.get(key);

      for (const p of order.products || []) {
        const pid      = p?.product_id ? String(p.product_id) : null;
        const title    = (pid && productMap[pid]) || 'Sản phẩm';
        const qty      = Number(p.quantity           || 0);
        const price    = Number(p.price              || 0);
        const discount = Number(p.discountPercentage || 0);
        const lineTotal = +(price * qty * (1 - discount / 100)).toFixed(0);

        entry.items.push({ title, qty, price, discount, lineTotal });
        entry.totalSpent = +(entry.totalSpent + lineTotal).toFixed(0);
      }
    }

    // Sắp xếp theo totalSpent giảm dần
    const purchases = [...purchasesMap.values()]
      .sort((a, b) => b.totalSpent - a.totalSpent);

    // Tổng doanh thu
    const grandTotal = purchases.reduce((s, p) => s + p.totalSpent, 0);

    res.render("admin/pages/dashboard/index.pug", {
      pageTitle: "Trang tổng quan",
      statistic,
      purchases,
      grandTotal
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Lỗi server");
  }
};
