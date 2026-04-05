// const systemConfig=require("../../config/system");
// const User=require("../../models/user.model");


// module.exports.requireAuth=async (req,res,next)=>{
//     if(!req.cookies.tokenUser){
//         res.redirect(`/user/login`);
//     }else{
//         const user=await User.findOne({
//            token:req.cookies.tokenUser
//         }).select("-password");
        
//         if(!user){
//            res.redirect(`/user/login`);
//         }
//             res.locals.user=user;//bien toan cuc cho moi file pug
           

//             next();
//         }
      
//     }
  
const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    if (!req.cookies.tokenUser) {
      return res.redirect('/user/login');
    }

    const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select("-password");

    if (!user) {
      return res.redirect('/user/login');
    }

    res.locals.user = user; // biến toàn cục cho Pug
    return next();
  } catch (err) {
    // Nếu có lỗi bất ngờ, chuyển cho error handler
    return next(err);
  }
};
