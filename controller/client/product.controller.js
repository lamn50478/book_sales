const Product=require("../../models/product.model")
const ProductCategory=require("../../models/products-category.model");
const productCategoryGetsub=require("../../helpers/product-category-getsub");
const productHelper=require("../../helpers/products");
module.exports.product=async (req,res)=>{
     const products= await Product
     .find({deleted:false,status:"active"})
     .sort({position : "desc"})
     const newProducts=products.map(item=>{
          item.priceNew=parseFloat((item.price*(100-item.discountPercentage)/100).toFixed(0));
          return item;
     })
    

     res.render("client/pages/product/product.pug",{
          pageTitle:"Trang danh sach san pham",
          products:newProducts
     })
}
//[GET] /products/detail/:slugcategory
module.exports.detailSlug=async (req,res)=>{
try{
      const slug=req.params.slugCategory;
   const find={
          deleted:false,
          slug:slug,
          status:"active"
   }

      
      const product =await Product.findOne(find);
      if(product.product_category_id){
          const category=await ProductCategory.findOne({
               _id:product.product_category_id,
               deleted:false,
               status:"active"
          });
          product.category=category;
      };
      product.priceNew=productHelper.newPriceProduct(product);
  
      product.price=parseFloat(product.price).toFixed(2);
      product.discountPercentage=parseFloat(product.discountPercentage).toFixed(2);
      product.newPrice=parseFloat((product.price*(100-product.discountPercentage)/100).toFixed(0));
      res.render('client/pages/product/detail.pug',{
         pageTitle:product.title,
         product:product
   
   })
}catch(error){
      req.flash("error","Back to home page")
      res.redirect(req.get("Referer")||"/products")
}
}

//[GET] products/category/:slugCategory

module.exports.slugCategory=async (req,res)=>{
    const category=await ProductCategory.findOne({
     slug:req.params.slugCategory,
     deleted:false
     

    });
    //Truy van ra danh muc cha va cac danh muc con cua no---------------
   
    
    const listSubCategory=await productCategoryGetsub.getSubCategory(category.id);
    const listSubCategoryId=listSubCategory.map((item)=>item.id);
    const products=await Product.find({
        product_category_id:{$in:[category.id,...listSubCategoryId]},
        deleted:false
    }).sort({position:"desc"});
    //end Truy van ra danh muc cha va cac danh muc con cua no
//     console.log(products)
    const newProducts=products.map(item=>{
          item.priceNew=parseFloat((item.price*(100-item.discountPercentage)/100).toFixed(0));
          return item;
     })
    

     res.render("client/pages/product/product.pug",{
          pageTitle:category.title,
          products:newProducts
     })
    

}
//[GET] /products/:id
module.exports.detail=async (req,res)=>{
try{
      const id=req.params.id;
   const find={
          deleted:false,
         _id:id,
          status:"active"
   }

    
      const product =await Product.findOne(find);
      product.price=parseFloat(product.price).toFixed(2);
      product.discountPercentage=parseFloat(product.discountPercentage).toFixed(2);
      product.newPrice=parseFloat((product.price*(100-product.discountPercentage)/100).toFixed(0));
      res.render('client/pages/product/detail.pug',{
         pageTitle:product.title,
         product:product
   
   })
}catch(error){
      req.flash("error","Back to home page")
      res.redirect(req.get("Referer")||"/products")
}
}
