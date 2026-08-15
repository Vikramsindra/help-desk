import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "agent"],
        default: "user",
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

export default User;