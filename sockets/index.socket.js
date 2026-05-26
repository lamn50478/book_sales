const chatSocket = require("./chat.socket");
const usersSocket=require("./users.socket")
// sau này thêm vào đây

module.exports = (io) => {
  chatSocket(io);
  usersSocket(io)
};