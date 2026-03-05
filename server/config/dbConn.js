const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

const conn = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB😇");
  } catch (error) {
    console.error(error);
  }
};
conn();
