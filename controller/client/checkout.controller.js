const Product=require("../../models/product.model")
const ProductCategory=require("../../models/products-category.model");
const productCategoryGetsub=require("../../helpers/product-category-getsub");
const productHelper=require("../../helpers/products");
const Cart=require("../../models/carts.model");
const Order=require("../../models/order.model");


//[GET] /cart :Lay ra cac san pham trong gio
module.exports.index=async (req,res)=>{
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


   res.render("client/pages/checkout/index",{
        pageTitle:"Trang giỏ hàng",
        cartDetail:cart,
        
       
      
    })
}
//[POST] /checkout/order : Lay ra thong tin thanh toan (user,product,cart)
module.exports.order=async (req,res)=>{
    const cartId=req.cookies.cartId;
    userInfor=req.body;
    const cart=await Cart.findOne({
        _id:cartId
    });
    let products=[]; //mang chua thong tin cua san pham
    for(const product of cart.products){
        const objectProduct={
            product_id:product.product_id,
            price:0,
            quantity:product.quantity,
            discountPercentage:0

        };
        const productInfor=await Product.findOne({
            _id:product.product_id
        });
        objectProduct.price=productInfor.price;
         objectProduct.discountPercentage=productInfor.discountPercentage;
        products.push(objectProduct); //products:thong tin cua list cac don hang
       
      
    };
    console.log(products);
    const objectOrder={
         
        // user_id:String,
        cartId:cartId,
        userInfor:userInfor
        ,
        products:products
    
    };
    
    const order=new Order(objectOrder);
    await order.save();
    await Cart.updateOne({
        _id:cartId
    },
    {
        products:[]
    }
)


    res.redirect(`/checkout/success/${order.id}`);
}
//[GET] /checkout/success/:orderId : thanh cong
module.exports.success=async (req,res)=>{
    
     const orderId=req.params.orderId;
     const order=await Order.findOne({
        _id:orderId
     });
     
     let products=[];
     for(const product of order.products){
         const productInfor=await Product.findOne({
            _id:product.product_id
         }).select("title thumbnail");
         product.productInfor=productInfor;
         product.priceNew=productHelper.newPriceProduct(product);
         product.totalPrice=product.priceNew*product.quantity;


     };
     order.totalPrices=order.products.reduce((sum,item)=>sum+item.totalPrice,0);
     console.log(order);
     res.render("client/pages/checkout/success",{
        pageTitle:"Trang thanh toán hoàn tất",
        order:order
        
       
      
    })
}