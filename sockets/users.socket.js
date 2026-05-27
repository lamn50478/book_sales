const Chat = require("../models/chat.model");
const uploadToCloudinary=require("../helpers/uploadToCloudinary.helper");
const User=require("../models/user.model");


module.exports = (io) => {
  io.on("connection", (socket) => {
//socket add friend
    
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
//socket cancel friend
     socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
         const myUserId = socket.handshake.auth.userId;
     
      //Xoa id cua A trong accept friend cua B 
      


      const existUserAinB=await User.findOne({
        _id:userId,
        acceptFriends:myUserId
      });
   
         await User.updateOne({
            _id:userId
         },{
            $pull:{ 
                acceptFriends:myUserId
            }
         });
    
      //Xoa id cua B trong request friend cua A 
      const existUserBinA=await User.findOne({
        _id:myUserId,
        requestFriends:userId
      });
   
         await User.updateOne({
            _id:myUserId
         },{
            $pull:{ 
                requestFriends:userId
            }
         });
 


    });

//socket refuse friend 
     socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
         const myUserId = socket.handshake.auth.userId;
        console.log(myUserId,"my id:----------------")
         console.log(userId,"other id:--");
      //Xoa id cua B trong accept friend cua A
      


      const existUserAinB=await User.findOne({
        _id:userId,
        acceptFriends:myUserId
      });
   
         await User.updateOne({
            _id:myUserId
         },{
            $pull:{ 
                acceptFriends:userId
            }
         });
    
      //Xoa id cua A trong request friend cua B
      const existUserBinA=await User.findOne({
        _id:userId,
        requestFriends:myUserId
      });
   
         await User.updateOne({
            _id:userId
         },{
            $pull:{ 
                requestFriends:myUserId
            }
         });
 


    });

  });
};