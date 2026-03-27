//[GET] admin-products
const mongoose=require("mongoose");
const Product=require('../../models/product.model');
const filterStatusHelpers=require('../../helpers/fillterStatus');
const searchHelpers=require('../../helpers/search');
const paginationHelpers=require('../../helpers/pagination');

const validate=require("../../validates/admin/products.validate.js")
const md5=require("md5");
const productCategory=require('../../models/products-category.model');
const Account=require("../../models/account.model.js");
const createTreeHelper=require("../../helpers/create-tree.js");
const systemConfig=require("../../config/system.js");

//[GET] admin/products
module.exports.index= async (req,res)=>{

 res.render("admin/pages/my-account/index",
    {
        pageTitle:"Trang thông tin cá nhân"
    }
 )



}
module.exports.edit= async (req,res)=>{

 res.render("admin/pages/my-account/edit",
    {
        pageTitle:"Chỉnh sửa thông tin"
    }
 )



}
module.exports.editPatch= async (req,res)=>{

 console.log(req.body);
 const id=res.locals.user.id;
     const emailExist=await Account.findOne({
         _id: { $ne:id } , //ne:not equal
         email:req.body.email,
         deleted:false
     });
     if(emailExist){
         req.flash("error",`email :${req.body.email} đã tồn tại !`);
         res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
 
         
     }else{
             if(req.body.password){
             req.body.password=md5(req.body.password);
         }else{
             delete req.body.password;
         }
         await Account.updateOne({_id:id},req.body)
     
         req.flash("success","Chỉnh sửa tài khoản thành công");
         // res.redirect(`${systemConfig.prefixAdmin}/accounts`);
         
     }
 res.redirect(`${systemConfig.prefixAdmin}/my-account`);



}