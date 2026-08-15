import jwt from "jsonwebtoken";

const generateToken = (data) => {
    const accessToken = jwt.sign(
        data,
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
        data,
        process.env.REFRESH_SECERT,
        { expiresIn: "7d" },
    )

    return { accessToken, refreshToken };
}

export { generateToken }