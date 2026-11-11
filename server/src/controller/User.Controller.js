import User from "../models/User.Model.js";
import mongoose from "mongoose";
import argon2 from "argon2";
import {
  loginSchema,
  staffSchema,
  staffUpdateSchema,
  staffListQuerySchema,
  directoryQuerySchema,
  customerUpdateSchema,
  userSchema,
} from "../utils/Schema.Validation.js";
import {
  generateToken,
  hashRefreshToken,
  refreshCookieOptions,
  sanitizeUser,
  escapeRegex,
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
        new ApiError(
          400,
          "VALIDATION_ERROR",
          error.details[0].message,
          error.details,
        ),
      );
    }

    const existingUser = await User.findOne({ email: value.email });

    if (existingUser) {
      return next(
        new ApiError(409, "USER_ALREADY_EXISTS", "User already exists"),
      );
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

    return res
      .status(201)
      .json(
        new ApiResponse(
          { accessToken, user: sanitizeUser(newUser) },
          "Registration successful",
        ),
      );
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new ApiError(409, "USER_ALREADY_EXISTS", "User already exists"),
      );
    }
    next(error);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

const loginController = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);

    if (error) {
      return next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          error.details[0].message,
          error.details,
        ),
      );
    }

    const user = await User.findOne({ email: value.email }).select(
      "+password +refreshTokenHash",
    );

    if (!user) {
      return next(
        new ApiError(401, "INVALID_CREDENTIALS", "Invalid credentials"),
      );
    }

    if (user.isActive === false) {
      return next(
        new ApiError(401, "ACCOUNT_INACTIVE", "Account is unavailable"),
      );
    }

    const isMatch = await argon2.verify(user.password, value.password);

    if (!isMatch) {
      return next(
        new ApiError(401, "INVALID_CREDENTIALS", "Invalid credentials"),
      );
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

    return res
      .status(200)
      .json(
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
        { algorithms: ["HS256"] },
      );
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return next(
          new ApiError(
            401,
            "REFRESH_TOKEN_EXPIRED",
            "Refresh token expired. Please login again.",
          ),
        );
      }
      return next(
        new ApiError(401, "REFRESH_TOKEN_INVALID", "Invalid refresh token"),
      );
    }

    if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return next(
        new ApiError(401, "REFRESH_TOKEN_INVALID", "Invalid refresh token"),
      );
    }

    // 3. Find user
    const user = await User.findById(decoded.id).select("+refreshTokenHash");

    if (!user) {
      return next(new ApiError(401, "USER_NOT_FOUND", "User not found"));
    }

    if (user.isActive === false) {
      return next(
        new ApiError(401, "ACCOUNT_INACTIVE", "Account is unavailable"),
      );
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
    return res
      .status(200)
      .json(new ApiResponse({ accessToken }, "Token refreshed successfully"));
  } catch (error) {
    next(error);
  }
};

// ─── Create staff ─────────────────────────────────────────────────────────────

const getCurrentUserController = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email role createdAt updatedAt",
    );

    if (!user) {
      return next(new ApiError(404, "USER_NOT_FOUND", "User not found"));
    }

    return res.status(200).json(
      new ApiResponse(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        "Current user fetched successfully",
      ),
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
        new ApiError(
          400,
          "VALIDATION_ERROR",
          error.details[0].message,
          error.details,
        ),
      );
    }

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return next(
        new ApiError(409, "USER_ALREADY_EXISTS", "User already exists"),
      );
    }

    const user = await User.create({
      name: value.name,
      email: value.email,
      password: await argon2.hash(value.password),
      role: value.role,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(sanitizeUser(user), "Staff user created successfully"),
      );
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new ApiError(409, "USER_ALREADY_EXISTS", "User already exists"),
      );
    }
    next(error);
  }
};

const getStaffListController = async (req, res, next) => {
  try {
    const { value, error } = staffListQuerySchema.validate(req.query);
    if (error) {
      return next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          error.details[0].message,
          error.details,
        ),
      );
    }

    const filter = { role: value.role || { $in: ["agent", "admin"] } };
    if (value.isActive !== undefined) filter.isActive = value.isActive;
    if (value.search) {
      const search = escapeRegex(value.search);
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (value.page - 1) * value.limit;
    const [staff, totalItems] = await Promise.all([
      User.find(filter)
        .select("name email role isActive createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(value.limit),
      User.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(totalItems / value.limit);

    return res.status(200).json(
      new ApiResponse(
        {
          items: staff.map((user) => ({ id: user._id, ...user.toObject() })),
          pagination: {
            page: value.page,
            limit: value.limit,
            totalItems,
            totalPages,
            hasNextPage: value.page < totalPages,
            hasPreviousPage: value.page > 1,
          },
        },
        "Staff fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

const getAgentCandidatesController = async (req, res, next) => {
  try {
    const { value, error } = directoryQuerySchema.validate({
      ...req.query,
      isActive: true,
    });
    if (error) {
      return next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          error.details[0].message,
          error.details,
        ),
      );
    }

    const filter = {
      role: "agent",
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    };
    if (value.search) {
      filter.$and = [
        {
          $or: [
            { name: { $regex: escapeRegex(value.search), $options: "i" } },
            { email: { $regex: escapeRegex(value.search), $options: "i" } },
          ],
        },
      ];
    }

    const skip = (value.page - 1) * value.limit;
    const [agents, totalItems] = await Promise.all([
      User.find(filter)
        .select("name email role isActive createdAt")
        .sort({ name: 1 })
        .skip(skip)
        .limit(value.limit),
      User.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(totalItems / value.limit);

    return res.status(200).json(
      new ApiResponse(
        {
          items: agents.map((agent) => ({
            id: agent._id,
            name: agent.name,
            email: agent.email,
            role: agent.role,
            isActive: agent.isActive !== false,
            createdAt: agent.createdAt,
          })),
          pagination: {
            page: value.page,
            limit: value.limit,
            totalItems,
            totalPages,
            hasNextPage: value.page < totalPages,
            hasPreviousPage: value.page > 1,
          },
        },
        "Active agents fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

const getCustomerListController = async (req, res, next) => {
  try {
    const { value, error } = directoryQuerySchema.validate(req.query);
    if (error) {
      return next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          error.details[0].message,
          error.details,
        ),
      );
    }

    const filter = { role: "user" };
    if (value.isActive === true) {
      filter.$or = [{ isActive: true }, { isActive: { $exists: false } }];
    } else if (value.isActive === false) {
      filter.isActive = false;
    }
    if (value.search) {
      filter.$and = [
        {
          $or: [
            { name: { $regex: escapeRegex(value.search), $options: "i" } },
            { email: { $regex: escapeRegex(value.search), $options: "i" } },
          ],
        },
      ];
    }

    const skip = (value.page - 1) * value.limit;
    const [customers, totalItems] = await Promise.all([
      User.find(filter)
        .select("name email role isActive createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(value.limit),
      User.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(totalItems / value.limit);

    return res.status(200).json(
      new ApiResponse(
        {
          items: customers.map((customer) => ({
            id: customer._id,
            name: customer.name,
            email: customer.email,
            role: customer.role,
            isActive: customer.isActive !== false,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
          })),
          pagination: {
            page: value.page,
            limit: value.limit,
            totalItems,
            totalPages,
            hasNextPage: value.page < totalPages,
            hasPreviousPage: value.page > 1,
          },
        },
        "Customers fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

const getCustomerDetailController = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return next(new ApiError(400, "INVALID_ID", "Invalid customer ID"));
    }

    const customer = await User.findOne({
      _id: customerId,
      role: "user",
    }).select("name email role isActive createdAt updatedAt");
    if (!customer) {
      return next(
        new ApiError(404, "CUSTOMER_NOT_FOUND", "Customer not found"),
      );
    }

    return res.status(200).json(
      new ApiResponse(
        {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          role: customer.role,
          isActive: customer.isActive !== false,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        },
        "Customer fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

const updateCustomerController = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return next(new ApiError(400, "INVALID_ID", "Invalid customer ID"));
    }

    const { value, error } = customerUpdateSchema.validate(req.body);
    if (error) {
      return next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          error.details[0].message,
          error.details,
        ),
      );
    }

    const update = { $set: value };
    if (!value.isActive) update.$unset = { refreshTokenHash: 1 };
    const customer = await User.findOneAndUpdate(
      { _id: customerId, role: "user" },
      update,
      { returnDocument: "after", runValidators: true },
    ).select("name email role isActive createdAt updatedAt");

    if (!customer) {
      return next(
        new ApiError(404, "CUSTOMER_NOT_FOUND", "Customer not found"),
      );
    }

    return res.status(200).json(
      new ApiResponse(
        {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          role: customer.role,
          isActive: customer.isActive !== false,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        },
        "Customer account updated successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

const getStaffDetailController = async (req, res, next) => {
  try {
    const { staffId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return next(new ApiError(400, "INVALID_ID", "Invalid staff ID"));
    }

    const user = await User.findOne({
      _id: staffId,
      role: { $in: ["agent", "admin"] },
    }).select("name email role isActive createdAt updatedAt");

    if (!user) {
      return next(
        new ApiError(404, "STAFF_NOT_FOUND", "Staff member not found"),
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          { id: user._id, ...user.toObject() },
          "Staff member fetched successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

const updateStaffController = async (req, res, next) => {
  try {
    const { staffId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return next(new ApiError(400, "INVALID_ID", "Invalid staff ID"));
    }

    const { value, error } = staffUpdateSchema.validate(req.body);
    if (error) {
      return next(
        new ApiError(
          400,
          "VALIDATION_ERROR",
          error.details[0].message,
          error.details,
        ),
      );
    }

    const update = { $set: value };
    if (value.isActive === false) update.$unset = { refreshTokenHash: 1 };

    const user = await User.findOneAndUpdate(
      { _id: staffId, role: { $in: ["agent", "admin"] } },
      update,
      { returnDocument: "after", runValidators: true },
    ).select("name email role isActive createdAt updatedAt");

    if (!user) {
      return next(
        new ApiError(404, "STAFF_NOT_FOUND", "Staff member not found"),
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          { id: user._id, ...user.toObject() },
          "Staff member updated successfully",
        ),
      );
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new ApiError(409, "USER_ALREADY_EXISTS", "Email already in use"),
      );
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
  getCurrentUserController,
  createStaffController,
  getStaffListController,
  getAgentCandidatesController,
  getStaffDetailController,
  updateStaffController,
  getCustomerListController,
  getCustomerDetailController,
  updateCustomerController,
  logoutController,
};
