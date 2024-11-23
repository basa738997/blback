import mongoose from "mongoose";
export const connectDb = async (req, res) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (conn) {
      console.log(`Mongodb Connected Successfully to ${conn.connection.host} `);
    }
  } catch (error) {
    console.log(`Mongodb Connection Error:${error}`);
  }
};
