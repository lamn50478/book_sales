const ProductRouter=require('./product_route');
const homeRouter=require('./home.router');
const searchRouter=require('./search.route');
const cartIdMiddleware=require("../../middeware/client/cartId.middleware.js");
const cartRouter=require("../../routers/client/cart.route.js");


const categoryMiddleware=require("../../middeware/client/category.middleware.js");
module.exports=(app)=>{
   app.use(categoryMiddleware.category);
   app.use(cartIdMiddleware.cartId);

   app.use('/',homeRouter);

   app.use('/products',ProductRouter);
   app.use('/search',searchRouter);
   app.use('/cart',cartRouter);


};

