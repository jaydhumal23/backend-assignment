const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        // 1. Get the token from the HEADER (NOT Cookies)
        const authHeader = req.headers.authorization;

        // Check if header exists and starts with "Bearer "
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
        }

        // 2. Extract the token (Remove "Bearer " string)
        const token = authHeader.split(" ")[1];

        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user info to request object (req.user)
        req.user = decoded;

        next(); // Move to the controller
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
    }
};

module.exports = authMiddleware;