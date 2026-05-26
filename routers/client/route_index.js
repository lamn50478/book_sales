const ProductRouter=require('./product_route');
const homeRouter=require('./home.router');
const searchRouter=require('./search.route');
const cartIdMiddleware=require("../../middeware/client/cartId.middleware.js");
const cartRouter=require("../../routers/client/cart.route.js");
const checkoutRouter=require("../../routers/client/checkout.route.js");
const userRouter=require("../../routers/client/user.router.js");
const usersRouter=require("../../routers/client/users.router.js");

const chatRouter=require("../../routers/client/chat.route.js");


const userMiddleware=require("../../middeware/client/user.middleware.js");
const authMiddleware=require("../../middeware/client/auth.middleware.js");


const settingMiddleware=require("../../middeware/client/setting.middleware.js");

const categoryMiddleware=require("../../middeware/client/category.middleware.js");
module.exports=(app)=>{
   app.use(categoryMiddleware.category);
   app.use(cartIdMiddleware.cartId);
   app.use(userMiddleware.inforUser);
   app.use(settingMiddleware.Setting);

   
   app.use('/',homeRouter);

   app.use('/products',ProductRouter);
   app.use('/search',searchRouter);
   app.use('/cart',cartRouter);
   app.use('/checkout',checkoutRouter);
   app.use('/user',userRouter);
   app.use('/users',authMiddleware.requireAuth,usersRouter);

   app.use('/chat',authMiddleware.requireAuth,chatRouter);

   




};

