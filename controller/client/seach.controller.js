const Product=require("../../models/product.model")
const ProductCategory=require("../../models/products-category.model");
const productCategoryGetsub=require("../../helpers/product-category-getsub");
const productHelper=require("../../helpers/products");
module.exports.search=async (req,res)=>{
    const keyword=req.query.keyword;
    const keywordRegex=new RegExp(keyword,"i");
    let newProducts=[];
    if(keyword){
         const products=await Product.find({
            title:keywordRegex,
            status:"active",
            deleted:"false"
         });
         newProducts=productHelper.priceNewProducts(products);
    };

     res.render('client/pages/search/index.pug',{
         pageTitle:"Trang tìm kiếm ",
         products:newProducts,
         keyword:keyword
   
   })
}
