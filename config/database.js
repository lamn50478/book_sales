// const mongoose=require('mongoose')
// module.exports.connect=async ()=>{
//     try{
//         await mongoose.connect(process.env.MONGO_URL)
//         console.log("Connect success");
//     }
//     catch(error){
//        console.log("Connect Error")
//     }
// }
const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Connect Error:", err.message);
  }
}

module.exports = { connect };



