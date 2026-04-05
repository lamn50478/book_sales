//[GET] admin-products
const mongoose=require("mongoose");
const Product=require('../../models/product.model');
const filterStatusHelpers=require('../../helpers/fillterStatus');
const searchHelpers=require('../../helpers/search');
const paginationHelpers=require('../../helpers/pagination');
const systemConfig=require("../../config/system.js");
const validate=require("../../validates/admin/products.validate.js")

const productCategory=require('../../models/products-category.model');
const Account=require("../../models/account.model.js");
const createTreeHelper=require("../../helpers/create-tree.js")
//[GET] admin/products
module.exports.products = async (req, res) => {
  try {
    const filterStatus = filterStatusHelpers(req.query);
    const find = { deleted: false };
    const objectSearch = searchHelpers(req.query);

    if (objectSearch.regex) find.title = objectSearch.regex;
    if (req.query.status) find.status = req.query.status;

    const countProducts = await Product.countDocuments();
    let objectPagination = paginationHelpers(
      { currentPage: 1, limitPages: "4" },
      countProducts,
      req.query
    );

    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.position = "desc";
    }

    const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagination.limitPages)
      .skip(objectPagination.skip);

    for (const product of products) {
      // ✅ Kiểm tra null trước khi query
      if (product.createdBy?.account_id) {
        const user = await Account.findOne({ _id: product.createdBy.account_id });
        if (user) product.accountFullname = user.fullName;
      }

      // ✅ Lưu thông tin updatedBy vào một object riêng, không gán lên array
      const lastUpdated = product.updatedBy?.length
        ? product.updatedBy[product.updatedBy.length - 1]
        : null;

      if (lastUpdated?.account_id) {
        const userUpdate = await Account.findOne({ _id: lastUpdated.account_id });
        if (userUpdate) {
          // ✅ Gán vào field riêng thay vì gán lên array
          product.lastUpdatedBy = {
            fullName: userUpdate.fullName,
            updatedAt: lastUpdated.updatedAt,
          };
        }
      }
    }

    res.render('admin/pages/products/products.pug', {
      pageTitle: "TRANG SAN PHAM",
      products,
      filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    });

  } catch (error) {
    // ✅ Bắt mọi lỗi, không để crash server
    console.error("Lỗi trang products:", error);
    req.flash("error", "Có lỗi xảy ra");
    res.redirect("/admin");
  }
};
//[PATCH] /admin/products/change-status/status/id
module.exports.changeStatus=async (req,res)=>{
    const status=req.params.status;
    const id=req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        
        return res.redirect("/admin/products");
}
    const updatedBy={
           account_id:res.locals.user.id,
           updatedAt:new Date()
      }
    await Product.updateOne({_id : id},{status:status,$push:{updatedBy:updatedBy}});
    req.flash('success',"Cập nhật trạng thái thành công!")
        
      res.redirect(req.get("Referrer") || "/admin/products");

   //  res.send(`${status},${id}`);

   //  res.redirect("back");
};
//[PATCH] /admin/products/change-status/status/id
module.exports.changeMulti=async (req,res)=>{
   const type=req.body.type;
   const ids=req.body.ids.split(", ");
    const updatedBy={
           account_id:res.locals.user.id,
           updatedAt:new Date()
      }
   switch (type){
      case "active":
         await Product.updateMany({ _id :{$in : ids}},{status : "active",$push:{updatedBy:updatedBy}});
         req.flash("success",`Cập nhật thành công trạng thái của ${ids.length} sản phẩm`);
         break;
      case "inactive":
         await Product.updateMany({ _id :{$in : ids}},{status : "inactive",$push:{updatedBy:updatedBy}});
          req.flash("success",`Cập nhật thành công trạng thái của ${ids.length} sản phẩm`);
         break;
      case "delete-all":
         // await Product.deleteMany({_id:{$in:ids}},)
         await Product.updateMany({_id :{$in:ids}},{
            deleted:true,
            deletedBy:{
                  account_id:res.locals.user.id,
                  deletedAt:new Date()
            }
         })
          req.flash("success",`Xóa thành công  ${ids.length} sản phẩm`);
         break;
      case "change-position":
         for (const item of ids) {
            
            let [id , position]=item.split("-");
            position=parseInt(position);
            console.log(id);
            console.log(position);

         await Product.updateOne({_id:id},{position:position});
         }
          req.flash("success",`Thay đổi vị trí thành công  ${ids.length} sản phẩm`);
      default :
        break;

   }
     res.redirect(req.get("Referer") || "admin/products");
};

//[DELETE] /admin/products/delete-item/id
module.exports.deleteProduct=async (req,res)=>{
   const id=req.params.id;

//   await Product.deleteOne({_id : id});
  await Product.updateOne({_id : id},{
    deleted:true,
   //  deletedAt:new Date()
   deletedBy:{
      account_id:res.locals.user.id,
      deletedAt:new Date()
   }
   });
    req.flash("success",`Xóa thành công sản phẩm`);

   res.redirect(req.get("Referer") || "admin/products");
};
//[GET] /admin/products/create
module.exports.create= async (req,res)=>{
 
    const find={
      deleted:false
   }
   

   const category=await productCategory.find(find);
   
   
   const newCategory=createTreeHelper.tree(category);
  
   res.render('admin/pages/products/create.pug',{
    pageTitle:"Thêm mới sản phẩm",
    category:newCategory
   
   })
};
//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  try {
    const permission = res.locals.role && res.locals.role.permission;
    if (!permission || !permission.includes("products_create")) {
      req.flash("error", "Bạn không có quyền thực hiện thao tác này");
      return res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

    // Chuyển kiểu an toàn
    req.body.price = parseFloat(req.body.price) || 0;
    req.body.discountPercentage = parseFloat(req.body.discountPercentage) || 0;
    req.body.stock = parseInt(req.body.stock) || 0;
    if (!req.body.position || req.body.position === "") {
      const count = await Product.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position) || 0;
    }

    // Kiểm tra res.locals.user
    if (!res.locals.user || !res.locals.user.id) {
      req.flash("error", "Không xác định người dùng");
      return res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

    req.body.createdBy = { account_id: res.locals.user.id };

    const product = new Product(req.body);
    await product.save();

    req.flash("success", "Thêm sản phẩm thành công");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (err) {
    console.error("Error createPost:", err);
    req.flash("error", "Thêm sản phẩm thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

//[GET] /admin/products/edit
module.exports.edit= async (req,res)=>{
try{
     const find={
      deleted:false,
      _id:req.params.id 
   }
   

   const product=await Product.findOne(find);
   
   const category= await productCategory.find({
      deleted:false
   })
   const newCategory=createTreeHelper.tree(category);

      res.render('admin/pages/products/edit.pug',{
         pageTitle:"Chỉnh sửa sản phẩm",
         product:product,
         category:newCategory
   
   })
}catch(error){
      req.flash("error","Back to home page")
      res.redirect(req.get("Referer")||"/admin/products")
}
};
//[PATCH] /admin/products/edit/id
module.exports.editPost= async (req,res)=>{
   const id=req.params.id;
   
   req.body.price=parseFloat(req.body.price)|| 0;
   req.body.discountPercentage=parseFloat( req.body.discountPercentage)|| 0;
   req.body.stock=parseInt( req.body.stock)|| 0;
   req.body.position = parseInt(req.body.position) || 0;

 
   // if(req.file){
   //       //  req.body.thumbnail=(`/uploads/${req.file.filename}`);
   // }
   // console.log(req.body) 
    try {
      const updatedBy={
           account_id:res.locals.user.id,
           updatedAt:new Date()
      }
       await Product.updateOne({_id:id},{
         ...req.body,
         $push:{updatedBy:updatedBy}
      });
   req.flash("success","Chỉnh sửa thành công");
   res.redirect(`${systemConfig.prefixAdmin}/products`);
    } catch (error) {
        req.flash("error","Chỉnh sửa thất bại");
   res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
   

};
//[GET] /admin/products/detail/:id
module.exports.detail= async (req,res)=>{
try{
      const id=req.params.id;
   const find={
          deleted:false,
          _id:id
   }

    
      const product =await Product.findOne(find);
      res.render('admin/pages/products/detail.pug',{
         pageTitle:product.title,
         product:product
   
   })
}catch(error){
      req.flash("error","Back to home page")
      res.redirect(req.get("Referer")||"/admin/products")
}
};