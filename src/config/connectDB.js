import mongoose from "mongoose";
require("dotenv").config();
mongoose.set("strictQuery", false);
const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    if (connection.connection.readyState === 1) {
      console.log(">>>>>connnection db sucess");
    }
  } catch (error) {
    console.log(">>>>>>error connection:", error);
    throw new Error("error");
  }
};
module.exports = dbConnect;
