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
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// ─── Register ─────────────────────────────────────────────────────────────────

const registerController = async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return next(
        new ApiError(400, "VALIDATION_ERROR", error.details[0].message, error.details),
      );
    }

    const existingUser = await User.findOne({ email: value.email });

    if (existingUser) {
      return next(new ApiError(409, "USER_ALREADY_EXISTS", "User already exists"));
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

    return res.status(201).json(
      new ApiResponse(
        { accessToken, user: sanitizeUser(newUser) },
        "Registration successful",
      ),
    );
  } catch (error) {
    next(error);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

const loginController = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);

    if (error) {
      return next(
        new ApiError(400, "VALIDATION_ERROR", error.details[0].message, error.details),
      );
    }

    const user = await User.findOne({ email: value.email }).select(
      "+refreshTokenHash",
    );

    if (!user) {
      return next(new ApiError(401, "INVALID_CREDENTIALS", "Invalid credentials"));
    }

    const isMatch = await argon2.verify(user.password, value.password);

    if (!isMatch) {
      return next(new ApiError(401, "INVALID_CREDENTIALS", "Invalid credentials"));
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

    return res.status(200).json(
      new ApiResponse(
        { accessToken, user: sanitizeUser(user) },
        "Login successful",
      ),
    );
  } catch (error) {
    next(error);
  }
};

// ─── Refresh ──────────────────────────────────────────────────────────────────

const refreshController = async (req, res, next) => {
  try {
    // 1. Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(
        new ApiError(401, "REFRESH_TOKEN_MISSING", "Refresh token required"),
      );
    }

    // 2. Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.REFRESH_SECRET,
      );
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return next(
          new ApiError(401, "REFRESH_TOKEN_EXPIRED", "Refresh token expired. Please login again."),
        );
      }
      return next(
        new ApiError(401, "REFRESH_TOKEN_INVALID", "Invalid refresh token"),
      );
    }

    // 3. Find user
    const user = await User.findById(decoded.id).select("+refreshTokenHash");

    if (!user) {
      return next(new ApiError(401, "USER_NOT_FOUND", "User not found"));
    }

    // 4. Check token stored in DB
    if (
      !user.refreshTokenHash ||
      hashRefreshToken(refreshToken) !== user.refreshTokenHash
    ) {
      return next(
        new ApiError(401, "REFRESH_TOKEN_INVALID", "Invalid refresh token"),
      );
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
    return res.status(200).json(
      new ApiResponse({ accessToken }, "Token refreshed successfully"),
    );
  } catch (error) {
    next(error);
  }
};

// ─── Create staff ─────────────────────────────────────────────────────────────

const createStaffController = async (req, res, next) => {
  try {
    const { error, value } = staffSchema.validate(req.body);
    if (error) {
      return next(
        new ApiError(400, "VALIDATION_ERROR", error.details[0].message, error.details),
      );
    }

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return next(new ApiError(409, "USER_ALREADY_EXISTS", "User already exists"));
    }

    const user = await User.create({
      name: value.name,
      email: value.email,
      password: await argon2.hash(value.password),
      role: value.role,
    });

    return res.status(201).json(
      new ApiResponse(sanitizeUser(user), "Staff user created successfully"),
    );
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(409, "USER_ALREADY_EXISTS", "User already exists"));
    }
    next(error);
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
//
// DOCUMENTED EXCEPTION: HTTP 204 No Content must not have a response body.
// ApiResponse is intentionally NOT used here.

const logoutController = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export {
  registerController,
  loginController,
  refreshController,
  createStaffController,
  logoutController,
};
