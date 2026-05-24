const mongoose=require('mongoose')
const generate=require("../helpers/generateToken");
const chatSchema= new mongoose.Schema({
   user_id:String,
   room_chat_id:String,
   images:[{ type: String }],
   content:String,
   deleted:{
     type:Boolean,
     default:false
   },
   deletedAt:Date

},{
  timestamps:true
});


const Chat=mongoose.model('Chat',chatSchema,"chat");
module.exports=Chat;