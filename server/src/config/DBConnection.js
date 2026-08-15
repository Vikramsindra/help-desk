import mongoose from "mongoose";

const connectToDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        console.log("MONGO_URI is not set. Skipping DB connection.");
        return;
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to database successfully");
    } catch (err) {
        console.log("Database connection error:");
        console.log(err);
    }
}

export default connectToDB;