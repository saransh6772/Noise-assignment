import { compare } from "bcrypt"; // Import bcrypt for password comparison
import { TryCatch } from "../middlewares/error.js"; // Import TryCatch wrapper for async error handling
import { User } from "../models/user.js"; // Import User model
import { Record } from "../models/record.js"; // Import Record model
import { cookieOptions, sendToken } from "../utils/features.js"; // Import cookie options and sendToken function
import { ErrorHandler } from "../utils/utility.js"; // Import custom error handler

// Create a new user
const newUser = TryCatch(async (req, res, next) => {
    const { name, username, password } = req.body;

    // Check for missing fields
    if (!name || !username || !password) return next(new ErrorHandler("Please fill in all fields", 400));

    let user = await User.findOne({ username }).select("+password");
    if (user) {
        sendToken(res, user, 200, `Welcome Back, ${user.name}`);
        return;
    }

    // Check if username already exists
    user = await User.findOne({ username });
    if (user) {
        return next(new ErrorHandler("This username is already taken", 400));
    }

    // Create a new user
    user = await User.create({
        name,
        username,
        password,
    });

    // Send token as a cookie and respond with success message
    sendToken(res, user, 201, "User created");
});

// User login
const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username }).select("+password");

    // Check if user exists
    if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

    // Compare password
    const isMatch = await compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("Invalid Username or Password", 404));

    // Send token as a cookie and respond with success message
    sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});

// User logout
const logout = TryCatch(async (req, res) => {
    // Clear the token cookie and respond with success message
    return res.status(200).cookie("noise", "", { ...cookieOptions, maxAge: 0 }).json({
        success: true,
        message: "Logged out successfully",
    });
});

// Delete a user by ID
const deleteUserById = TryCatch(async (req, res, next) => {
    // Find user by ID
    const user = await User.findById(req.params.userId);

    // Check if user exists
    if (!user) {
        return next(new ErrorHandler("User does not exists", 404));
    }

    // Delete the user and respond with success message
    await user.deleteOne();
    return res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});

// Update a user by ID
const updateUserById = TryCatch(async (req, res, next) => {
    // Find user by ID
    let user = await User.findById(req.params.userId);

    // Check if user exists
    if (!user) {
        return next(new ErrorHandler("User does not exists", 404));
    }

    // Retrieve updated user details from request body
    const { name, username, password } = req.body;

    // Check for missing fields
    if (!name || !username || !password) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }

    // Check if username already exists
    const existUser = await User.findOne({ username });
    if (existUser) {
        return next(new ErrorHandler("This username is already taken", 400));
    }

    // Update user details and respond with success message
    user = await user.updateOne({
        name,
        username,
        password,
    });
    return res.status(200).json({
        success: true,
        message: "User updated successfully",
    });
});

// Get user records by ID
const getUserRecordsByID = TryCatch(async (req, res, next) => {
    // Find user by ID
    const user = await User.findById(req.params.userId);

    // Check if user exists
    if (!user) {
        return next(new ErrorHandler("User does not exists", 404));
    }

    // Find records associated with the user and respond with success message
    const records = await Record.find({ user });
    return res.status(200).json({
        success: true,
        message: "User records fetched successfully",
        data: records,
    });
});

// Export the functions
export { newUser, login, logout, deleteUserById, updateUserById, getUserRecordsByID };
