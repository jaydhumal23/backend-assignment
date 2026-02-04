const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        // 1. Get the token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
        }

        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach user info to request object (req.user)
        req.user = decoded; 
        
        next(); // Move to the next function (the controller)
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
    }
};

module.exports = authMiddleware;