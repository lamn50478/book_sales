const Chat = require("../models/chat.model");
const uploadToCloudinary=require("../helpers/uploadToCloudinary.helper");
const User=require("../models/user.model");


module.exports = (io) => {
  io.on("connection", (socket) => {
    
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
         const myUserId = socket.handshake.auth.userId;
        console.log(myUserId,"my id:----------------")
      console.log(userId,"other id:--");
      //Them id cua A vao accept friend cua B 
      


      const existUserAinB=await User.findOne({
        _id:userId,
        acceptFriends:myUserId
      });
      if(!existUserAinB){
         await User.updateOne({
            _id:userId
         },{
            $push:{ 
                acceptFriends:myUserId
            }
         });
      };
      //Them id cua B vao request friend cua A 
      const existUserBinA=await User.findOne({
        _id:myUserId,
        requestFriends:userId
      });
      if(!existUserBinA){
         await User.updateOne({
            _id:myUserId
         },{
            $push:{ 
                requestFriends:userId
            }
         });
      };


    });
  });
};