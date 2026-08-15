import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        // 1. Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Access token required"
            });
        }

        // 2. Check Bearer format
        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const token = parts[1];

        // 3. Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        // 4. Store decoded user information
        req.user = decoded;

        // 5. Continue to protected controller
        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Access token expired"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid access token"
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


const checkAdminOrAgent = async (req, res, next) => {

}

export { authMiddleware };