import mongoose from "mongoose";

const connectToDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) throw new Error("MONGO_URI is not set");

  try {
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    throw err;
  }
};

export default connectToDB;
