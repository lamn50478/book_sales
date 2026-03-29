const mongoose=require('mongoose')
const generate=require("../helpers/generateToken");
const UserSchema= new mongoose.Schema({
   fullName:String,
   email:String,
   password:String,
   tokenUser:{
    type:String,
    default:generate.generateRandomString(20)
   },
   phone:String,
   avatar:String,
   role_id:String,
   status:String,
  deleted: {
    type:Boolean,
    default:false
  },
  deletedAt:Date
},{
  timestamps:true
});


const User=mongoose.model('User',UserSchema,"Users");
module.exports=User;