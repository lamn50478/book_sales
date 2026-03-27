const mongoose=require("mongoose");
const productCategory=require('../../models/products-category.model');
const Product=require("../../models/product.model.js");
const createTreeHelper=require("../../helpers/create-tree.js")
const productHelpers=require("../../helpers/products.js");

module.exports.index=async (req,res)=>{
  //danh muc noi bat
      const  productCategories=await productCategory.find({
          
          deleted:false,
          status:"active"
      }).limit(3).sort({position:"asc"}).lean();  
//san pham ban chay
      const productFeatured=await Product.find({
        featured:"1",
        deleted:false,
        status:"active"
      }).limit(5);
      const newProducts=productHelpers.priceNewProducts(productFeatured);
//san pham moi 
      
      const productNew1=await Product.find({
        featured:"1",
        deleted:false,
        status:"active"
      }).limit(3).lean();;
      const productNew2=productHelpers.priceNewProducts(productNew1);
     
//end san pham moi
    res.render("client/pages/home/index",{
        pageTitle:"Trang chu",
        productCategories:productCategories,
        products:newProducts,
        productNew2:productNew2
      
    })
}
module.exports.index2=async (req,res)=>{
    //lay ra san pham noi bat-----------
      const productFeatured=await Product.find({
        featured:"1",
        deleted:false,
        status:"active"
      }).limit(6);
      const newProducts=productHelpers.priceNewProducts(productFeatured);
    //end lay ra san pham noi bat
    
    // console.log("demo:",productFeatured);
    //---------------------
    //lay ra san pham new


      const productNew=await Product.find({
       
        deleted:false,
        status:"active"
      }).sort({position:"desc"}).limit(6);
       const newProductsNew=productHelpers.priceNewProducts(productNew);
       

    //end lay ra san pham new

    res.render("client/pages/home/index2",{
        pageTitle:"Trang chu demo",
        productFeatured:newProducts,
        productNew:newProductsNew
      
    })
}
