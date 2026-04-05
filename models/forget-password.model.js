const mongoose=require('mongoose')
const generate=require("../helpers/generateToken");
const ForgetPassSchema= new mongoose.Schema({
    email:String,
    otp:Number,
    expireAt:{
        type:Date,
        expires:180
    }
},{
  timestamps:true
});


const ForgetPass=mongoose.model('ForgetPass',ForgetPassSchema,"ForgetPass");
module.exports=ForgetPass;