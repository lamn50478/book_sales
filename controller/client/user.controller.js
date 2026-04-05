const Product=require("../../models/product.model")
const ProductCategory=require("../../models/products-category.model");
const productCategoryGetsub=require("../../helpers/product-category-getsub");
const productHelper=require("../../helpers/products");
const User=require("../../models/user.model");
const ForgetPass=require("../../models/forget-password.model");
const generate=require("../../helpers/generateToken"); 
const  sendMailHelper=require("../../helpers/sendMail");
const Cart=require("../../models/carts.model");

const md5=require("md5");
module.exports.register=async (req,res)=>{
   
    console.log(req.body);
     res.render('client/pages/users/register.pug',{
         pageTitle:"Trang dang ky "
        
   })
}
module.exports.registerPost=async (req,res)=>{
   const existEmail=await User.findOne({
        email:req.body.email,
        deleted:false
   });
   if(existEmail){
        req.flash("error","Tai khoan email da ton tai!");
        res.redirect("/user/register");
        return;
   };
   req.body.password=md5(req.body.password);
   const user=new User(req.body);
    await user.save();
    console.log(user);
    res.cookie("tokenUser",user.tokenUser);
    res.redirect("/");
}

module.exports.login=async (req,res)=>{
   
    console.log(req.body);
     res.render('client/pages/users/login.pug',{
         pageTitle:"Trang dang nhap "
        
   })
}
module.exports.loginPost=async (req,res)=>{
   const email=req.body.email;
   const password=req.body.password;
   const cartId=req.cookies.cartId;
   const user=await User.findOne({
        email:req.body.email,
        deleted:false
   });
    if(!user){
         req.flash("error","Tai khoan email loi hoac chua dang ki!!");
        res.redirect("/user/login");
         return;
    }
    if(md5(password)!=user.password){
         req.flash("error","Sai mat khau!!");
        res.redirect("/user/login");
         return;
    }
    if(user.status=="inactive"){
         req.flash("error","Tai khoan email loi hoac chua dang ki!!");
        res.redirect("/user/login");
         return;
    }
    res.cookie("tokenUser",user.tokenUser);
    console.log(user.id);
    console.log(cartId);
    await Cart.updateOne({
        _id:cartId
    },{
        user_id:user.id
    })
    req.flash("success","Dang nhap thanh cong");
     res.redirect("/");
}

module.exports.logout=async (req,res)=>{
   
    res.clearCookie("tokenUser");
    res.redirect("/");
        
   
}
module.exports.forgetPassword=async (req,res)=>{
   
    res.render('client/pages/users/forget.pug',{
         pageTitle:"Trang quen mat khau "
        
   })
   
}
module.exports.forgetPasswordPost=async (req,res)=>{
   const email=req.body.email;
  
const user=await User.findOne({
    email:req.body.email,
    deleted:false
});
      if(!user){
         req.flash("error","Tai khoan email loi hoac chua dang ki!!");
        res.redirect("/user/password/forget");
        return;
    };

//Tao ma otp
    const otp=generate.generateRandomNumber(6);
    const forgetPassObject={
        email:req.body.email,
        otp:otp,
        expireAt:Date.now()
    }
    
    forgetPassObject.otp=generate.generateRandomNumber(6);
    
    const forgetPassword=new ForgetPass(forgetPassObject);
    await forgetPassword.save();
//Gui otp qua email
    const subject="Mã otp lấy lại mật khẩu";
    const html=`Mã OTP lấy lại mật khẩu là:<b>${otp}</b>. Vui lòng không chia sẻ mã này cho bất kì ai`;
    sendMailHelper.sendMail(email,subject,html);
    res.redirect(`/user/password/otp?email=${email}`);
   
}

module.exports.otpPassword=async (req,res)=>{
   const email=req.query.email;
    res.render('client/pages/users/otp-password.pug',{
         pageTitle:"Trang nhap otp",
         email:email
        
   })
   
}
module.exports.otpPasswordPost=async (req,res)=>{
   const email=req.body.email;
   const otp=req.body.otp;
  
  const result=await ForgetPass.findOne({
        email:email,
        otp:otp
  });
  if(!result){
      req.flash("error","Tai khoan email loi hoac ma otp khong khop!!");
        res.redirect("/user/password/forget");
        return;
  };

  const user=await User.findOne({
    email:email
  });
  res.cookie("tokenUser",user.tokenUser);
  res.redirect("/user/password/reset");
  
 
   
}

module.exports.reset=async (req,res)=>{
   
    console.log(req.body);
     res.render('client/pages/users/reset-password.pug',{
         pageTitle:"Trang lấy lại mật khẩu! "
        
   })
}


module.exports.resetPost=async (req,res)=>{
   const password=req.body.password;
   const resetPassword=req.body.resetPassword;
   const tokenUser=req.cookies.tokenUser;
    
    console.log(tokenUser);
    await User.updateOne({
        tokenUser:tokenUser
    },
    {
        password:md5(password)
    });
     req.flash("success","Cap nhat mat khau thanh cong!");
     res.redirect("/user/login");
}

module.exports.infor=async (req,res)=>{
   
   
     res.render('client/pages/users/infor.pug',{
         pageTitle:"Thông tin tài khoản "
        
   })
}