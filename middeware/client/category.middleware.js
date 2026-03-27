const mongoose=require("mongoose");
const productCategory=require('../../models/products-category.model');
const createTreeHelper=require("../../helpers/create-tree.js")
module.exports.category=async (req,res,next)=>{
     const records=await productCategory.find({
        deleted:false
       });
   
   
   const newProductsCategory=createTreeHelper.tree(records);
    res.locals.layoutProductsCategory=newProductsCategory;
    next();
}