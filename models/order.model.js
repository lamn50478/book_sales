const mongoose=require('mongoose')
var slug=require('mongoose-slug-updater')
mongoose.plugin(slug);
const orderSchema= new mongoose.Schema(
    {
        // user_id:String,
        cartId:String,
        userInfor:{
            fullName:String,
            phone:Number,
            address:String
        },
        products:[
            {
                product_id:String,
                price:Number,
                discountPercentage:Number,
                quantity:Number
            }
        ]
    }
  ,{
  timestamps:true
});


const Order=mongoose.model('Order',orderSchema,"orders")
module.exports=Order;