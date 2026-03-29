const Product=require("../../models/product.model")
const ProductCategory=require("../../models/products-category.model");
const productCategoryGetsub=require("../../helpers/product-category-getsub");
const productHelper=require("../../helpers/products");
const Cart=require("../../models/carts.model");

//[GET] /cart
module.exports.cart=async (req,res)=>{
    const cartId=req.cookies.cartId;
    const cart=await Cart.findOne({
        _id:cartId
    });
    
    // console.log(cart); 
    if(cart.products.length > 0){
        for(const item of cart.products){
            const productId=item.product_id;
            const productInfor=await Product.findOne({
                _id:productId
            });
            productInfor.priceNew=productHelper.newPriceProduct(productInfor);
            item.productInfor=productInfor;
            item.totalPrice=item.quantity*productInfor.priceNew;
            
        };
         cart.totalPrice=cart.products.reduce((sum,item)=>sum+item.totalPrice,0);
    }


   res.render("client/pages/cart/index",{
        pageTitle:"Trang giỏ hàng",
        cartDetail:cart,
        
       
      
    })
}
//[DELETE] /cart/delete/:productId
module.exports.cartDelete=async (req,res)=>{

    const productId=req.params.productId;
    const cartId=req.cookies.cartId;
    console.log(productId);
    await Cart.updateOne({
        _id:cartId
    },{
        "$pull":{
            products:{
                "product_id":productId
            }
        }
    });

  req.flash("success","Xóa sản phẩm thành công");
  res.redirect(`/cart`);
}

//[POST] /cart/add/:productId
module.exports.addPost=async (req,res)=>{
    const cartId=req.cookies.cartId;
    const productId=req.params.productId;
    const quantity=parseInt(req.body.quantity);
    const cart=await Cart.findOne({
        _id:cartId
    });
    
    const existItem= cart.products.find(item =>item.product_id==productId);
    if(existItem){
        //cap nhat quantity
        const newQuantity=quantity+existItem.quantity;
        console.log(newQuantity);
        await Cart.updateOne({
            _id:cartId,
            'products.product_id':productId
        },{
            'products.$.quantity':newQuantity
        });
    }
    else{
        const objectCart={
        product_id:productId,
        quantity:quantity
    };
    await Cart.updateOne({
        _id:cartId
    },{
        $push:{
            products:objectCart
        }
    });
    }
    
    req.flash("success",`Thêm thành công ${quantity} sản phẩm vào giỏ hàng`);
    res.redirect(`/products/${productId}`);
}

//[POST] /cart/update/:productId/quantity
module.exports.cartUpdate=async (req,res)=>{
    const cartId=req.cookies.cartId;
    const productId=req.params.productId;
    const quantity=req.params.quantity;
    console.log(quantity);
    const cart=await Cart.findOne({
        _id:cartId
    });
    
    const existItem= cart.products.find(item =>item.product_id==productId);
    if(existItem){
       
        await Cart.updateOne({
            _id:cartId,
            'products.product_id':productId
        },{
            'products.$.quantity':quantity
        });
    }
    else{
        const objectCart={
        product_id:productId,
        quantity:quantity
    };
    await Cart.updateOne({
        _id:cartId
    },{
        $push:{
            products:objectCart
        }
    });
    }
    
    
    req.flash("success",`Cập nhật thành công ${quantity} sản phẩm vào giỏ hàng`);
    res.redirect(`/cart`);
}