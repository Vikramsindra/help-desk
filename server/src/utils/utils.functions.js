import jwt from "jsonwebtoken";

const generateToken = (data) => {
    const accessSecret = process.env.ACCESS_SECRET;
    const refreshSecret = process.env.REFRESH_SECRET;

    if (!accessSecret) throw new Error("ACCESS_SECRET (env) is not set");
    if (!refreshSecret) throw new Error("REFRESH_SECRET (env) is not set");

    const accessToken = jwt.sign(data, accessSecret, { expiresIn: "15m" });
    const refreshToken = jwt.sign(data, refreshSecret, { expiresIn: "7d" });

    return { accessToken, refreshToken };
}

export { generateToken }