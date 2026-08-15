import User from "../models/User.Model.js";
import argon2 from "argon2";
import { userSchema } from "../utils/Schema.Validation.js"
import { generateToken } from "../utils/utils.functions.js";

const registerController = async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = userSchema.validate(data);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const existingUser = await User.findOne({ email: value.email });

        if (existingUser) {
            return res.status(400).json({ message: "user alreadly exist" });
        };


        const hashedPassword = await argon2.hash(value.password);
        const newUser = new User({
            ...value,
            password: hashedPassword
        });

        const { accessToken, refreshToken } = generateToken({ email: newUser.email, name: newUser.name, id: newUser._id, });

        newUser.refreshToken = refreshToken;

        await newUser.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(201).json({ accessToken });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};



export { registerController };