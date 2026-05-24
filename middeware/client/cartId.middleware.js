// const Cart=require('../../models/carts.model');
// module.exports.cartId=async (req,res,next)=>{
//     const  cartId=req.cookies.cartId;
//     if(!cartId){
//         const cart=new Cart();
//         await cart.save();
//         const expiresTime=1000*60*60*24*365;
//         res.cookie("cartId",cart.id,{
//             expires:new Date(Date.now()+expiresTime)
//         });
//         console.log(cart);
//     }else{
//         const cart=await Cart.findOne({
//             _id:cartId
//         });
         
//         cart.totalQuantity=cart.products.reduce((sum,item)=>sum+item.quantity,0);
//         res.locals.miniCart=cart.totalQuantity;

//     }
    
//     next();
// }
const Cart = require('../../models/carts.model');  // ← thêm "c" vào

module.exports.cartId = async (req, res, next) => {
    const cartId = req.cookies.cartId;
    if (!cartId) {
        const cart = new Cart();
        await cart.save();
        const expiresTime = 1000 * 60 * 60 * 24 * 365;
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        });
    } else {
        const cart = await Cart.findOne({ _id: cartId });
        if (cart) {
            cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
            res.locals.miniCart = cart.totalQuantity;
        } else {
            res.clearCookie("cartId");
        }
    }
    next();
}