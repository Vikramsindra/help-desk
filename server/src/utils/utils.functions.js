import jwt from "jsonwebtoken";
import crypto from "crypto";

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure:
    process.env.NODE_ENV === "production" ||
    process.env.COOKIE_SAME_SITE?.toLowerCase() === "none",
  sameSite: ["strict", "lax", "none"].includes(
    process.env.COOKIE_SAME_SITE?.toLowerCase(),
  )
    ? process.env.COOKIE_SAME_SITE.toLowerCase()
    : "lax",
  path: "/api/user",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const hashRefreshToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const generateToken = (data) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret) throw new Error("JWT_ACCESS_SECRET (env) is not set");
  if (!refreshSecret) throw new Error("JWT_REFRESH_SECRET (env) is not set");

  const accessToken = jwt.sign(data, accessSecret, { expiresIn: "15m" });
  const refreshToken = jwt.sign(data, refreshSecret, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

export {
  generateToken,
  hashRefreshToken,
  refreshCookieOptions,
  sanitizeUser,
  escapeRegex,
};
