const Chat = require("../models/chat.model");
const uploadToCloudinary=require("../helpers/uploadToCloudinary.helper");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const userId = socket.handshake.auth.userId;
      const fullName = socket.handshake.auth.fullName;

      let images=[];
      for (const base64Str of data.images) {
    // base64Str dạng: "data:image/png;base64,iVBORw0K..."
          const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, ""); // ← bỏ prefix
          const buffer = Buffer.from(base64Data, "base64"); // ← convert sang Buffer
          const link = await uploadToCloudinary(buffer);
          images.push(link);
  }


      const chat = new Chat({
         user_id: userId,
          content:data.content,
          images:images 
          });
      await chat.save();
      
      io.emit("SERVER_RETURN_MESSAGE", { userId, fullName, content:data.content,images:images });
    });



    socket.on("CLIENT_SEND_TYPING",(type)=>{
         const userId = socket.handshake.auth.userId;
        const fullName = socket.handshake.auth.fullName;
       
        socket.broadcast.emit("SERVER_RETURN_TYPING",{
            userId:userId,
            fullName:fullName,
            type:type
        });
    });
  });
};