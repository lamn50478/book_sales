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

module.exports.notFriend=async (req,res)=>{
    
   const userId=res.locals.user.id;
     const myUser=await User.findOne({
            _id:userId
        });
        const requestFriends=myUser ? (myUser.requestFriends || []) : [];
        const acceptFriends=myUser ? (myUser.acceptFriends || []) : [];
        const allIdRemove=[userId,...requestFriends,...acceptFriends];
    const users=await User.find({
        _id:{                 //ket hop nhieu dieu kien https://stackoverflow.com/questions/62206664/mongoose-query-to-find-based-on-multiple-not-equals    
             $nin:allIdRemove,
    },

        // _id:{$ne:userId},
        // _id:{$nin:{requestFriends}}, // so sanh 1 gia tri voi nhieu gia tri trong 1 array https://stackoverflow.com/questions/58045223/how-can-i-find-all-object-not-equal-to-array-of-ids-from-mongo-db-using-mongoose
       
        deleted:false
    }).select("avatar fullName")
    console.log(users);
     res.render('client/pages/friends/not-friend.pug',{
         pageTitle:"Trang danh sach nguoi dung ",
         users:users
        
   })
}
//[GET] /users/request
module.exports.request=async (req,res)=>{
    
   const userId=res.locals.user.id;
     const myUser=await User.findOne({
            _id:userId
        });
        const requestFriends=myUser ? (myUser.requestFriends || []) : [];
        const acceptFriends=myUser ? (myUser.acceptFriends || []) : [];

    const users=await User.find({
        _id:{ $in:requestFriends  },
        deleted:false
    }).select(" id avatar fullName")
    console.log(users);
     res.render('client/pages/friends/request.pug',{
         pageTitle:"Lời mời đã gửi ",
         users:users
        
   })
}

//[GET] /users/request
module.exports.accept=async (req,res)=>{
    
   const userId=res.locals.user.id;
     const myUser=await User.findOne({
            _id:userId
        });
        const requestFriends=myUser ? (myUser.requestFriends || []) : [];
        const acceptFriends=myUser ? (myUser.acceptFriends || []) : [];

    const users=await User.find({
        _id:{ $in:acceptFriends  },
        deleted:false
    }).select(" id avatar fullName")
    console.log(users);
     res.render('client/pages/friends/accept.pug',{
         pageTitle:"Lời mời đã nhận ",
         users:users
        
   })
}