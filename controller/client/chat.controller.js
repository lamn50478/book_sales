const Product=require("../../models/product.model")
const ProductCategory=require("../../models/products-category.model");
const productCategoryGetsub=require("../../helpers/product-category-getsub");
const productHelper=require("../../helpers/products");
const Cart=require("../../models/carts.model");
const Chat=require("../../models/chat.model");
const User=require("../../models/user.model");




//[GET] /cart
module.exports.index=async (req,res)=>{
  
  
    const chats=await Chat.find({
      deleted:false
    }).sort({ createdAt: -1 }).limit(20).lean();
    
    chats.reverse();
    for(const chat of chats){
         const inforUser=await User.findOne({
               _id:chat.user_id
         }).select("fullName").lean();
         chat.inforUser=inforUser;
    };


    res.render("client/pages/chat/index",{
        pageTitle:"Trang giỏ hàng",
        chats:chats
      
        
       
      
    })
}