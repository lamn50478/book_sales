const chatSocket = require("./chat.socket");

// sau này thêm vào đây

module.exports = (io) => {
  chatSocket(io);
  
};