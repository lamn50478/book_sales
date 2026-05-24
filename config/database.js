const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
      tls: true,
    });
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Connect Error:", err.message);
  }
}

module.exports = { connect };