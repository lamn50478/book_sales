const mongoose=require('mongoose')
const generate=require("../helpers/generateToken");
const settingSchema= new mongoose.Schema({
   
   email:String,
   websiteName:String,
   logo:String,
   phone:Number,
   address:String,
   copyright:String

},{
  timestamps:true
});


const Setting=mongoose.model('Setting',settingSchema,"setting");
module.exports=Setting;