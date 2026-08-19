import User from "../models/User.Model.js";
import argon2 from "argon2";
import { loginSchema, userSchema } from "../utils/Schema.Validation.js";
import { generateToken } from "../utils/utils.functions.js";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    const data = req.body;
    const { error, value } = userSchema.validate(data);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const existingUser = await User.findOne({ email: value.email });

    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashedPassword = await argon2.hash(value.password);
    const newUser = new User({
      ...value,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateToken({
      email: newUser.email,
      name: newUser.name,
      id: newUser._id,
      role: newUser.role,
    });

    newUser.refreshToken = refreshToken;

    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const data = req.body;

    const { value, error } = loginSchema.validate(data);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const user = await User.findOne({ email: value.email });

    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const isMatch = await argon2.verify(user.password, value.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    user.refreshToken = refreshToken;

    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const refreshController = async (req, res) => {
  try {
    // 1. Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    // 2. Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.REFRESH_SECRET,
    );

    // 3. Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 4. Check token stored in DB
    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // 5. Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // 6. Store new refresh token
    user.refreshToken = newRefreshToken;

    await user.save();

    // 7. Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 8. Send new access token
    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Refresh token expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { registerController, loginController, refreshController };
