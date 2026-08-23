import User from "../models/User.Model.js";
import argon2 from "argon2";
import {
  loginSchema,
  staffSchema,
  userSchema,
} from "../utils/Schema.Validation.js";
import {
  generateToken,
  hashRefreshToken,
  refreshCookieOptions,
  sanitizeUser,
} from "../utils/utils.functions.js";
import jwt from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const existingUser = await User.findOne({ email: value.email });

    if (existingUser) {
      return res.status(409).json({ message: "user already exists" });
    }

    const hashedPassword = await argon2.hash(value.password);
    const newUser = new User({
      ...value,
      role: "user",
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateToken({
      email: newUser.email,
      name: newUser.name,
      id: newUser._id,
      role: newUser.role,
    });

    newUser.refreshTokenHash = hashRefreshToken(refreshToken);

    await newUser.save();

    res.cookie("refreshToken", refreshToken, refreshCookieOptions());

    res.status(201).json({ accessToken, user: sanitizeUser(newUser) });
  } catch (error) {
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

    const user = await User.findOne({ email: value.email }).select(
      "+refreshTokenHash",
    );

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

    user.refreshTokenHash = hashRefreshToken(refreshToken);

    await user.save();

    res.cookie("refreshToken", refreshToken, refreshCookieOptions());

    res.status(200).json({
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
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
    const user = await User.findById(decoded.id).select("+refreshTokenHash");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 4. Check token stored in DB
    if (
      !user.refreshTokenHash ||
      hashRefreshToken(refreshToken) !== user.refreshTokenHash
    ) {
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
    user.refreshTokenHash = hashRefreshToken(newRefreshToken);

    await user.save();

    // 7. Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions());

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

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createStaffController = async (req, res) => {
  const { error, value } = staffSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser)
      return res.status(409).json({ message: "user already exists" });

    const user = await User.create({
      name: value.name,
      email: value.email,
      password: await argon2.hash(value.password),
      role: value.role,
    });
    return res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ message: "user already exists" });
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logoutController = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    await User.findOneAndUpdate(
      { refreshTokenHash: hashRefreshToken(token) },
      { $unset: { refreshTokenHash: 1 } },
    );
  }
  return res
    .clearCookie("refreshToken", refreshCookieOptions())
    .status(204)
    .send();
};

export {
  registerController,
  loginController,
  refreshController,
  createStaffController,
  logoutController,
};
