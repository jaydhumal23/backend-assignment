const bcrypt = require("bcrypt");
const userModel = require("../model/UserModel");
const jwt = require("jsonwebtoken");

// --- Helper to generate Token ---
const generateToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// 1. REGISTER
const userRegister = async (req, res) => {
    const { name, email, role, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            name,
            email,
            role,
            password: hash
        });

        // Generate token immediately so they are logged in
        const token = generateToken(user._id, user.email, user.role);

        console.log(`User Registered: ${user.email}`);

        res.status(201).json({
            success: true,
            token, // <--- Frontend needs this
            user: {
                _id: user._id, // Frontend often needs ID
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(`Registration Error: ${error}`);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// 2. LOGIN
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        const token = generateToken(user._id, user.email, user.role);

        // SEND TOKEN IN JSON (No Cookie)
        res.status(200).json({
            success: true,
            token, // <--- Frontend saves this to LocalStorage
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. LOGOUT (Stateless)
const userLogout = (req, res) => {
    try {
        // Since we use LocalStorage, the backend doesn't need to clear cookies.
        // The frontend simply removes the token.
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        res.status(400).json({ success: false, err });
    }
};

// 4. GET ME (The missing controller)
const getMe = async (req, res) => {
    try {
        // req.user.id comes from the authMiddleware
        console.log(req.user)
        const user = await userModel.findById(req.user.id).select("-password"); // Exclude password

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { userLogin, userRegister, userLogout, getMe };