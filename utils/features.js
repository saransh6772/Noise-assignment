import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Cookie options configuration for setting secure and HTTP-only cookies
const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie will expire in 15 days
    sameSite: "none", // Cross-site requests allowed
    httpOnly: true, // Cookie is accessible only by the web server
    secure: true, // Cookie is sent only over HTTPS
};

// Function to connect to MongoDB database
const connectDB = (uri) => {
    mongoose.connect(uri, { dbName: "Noise" })
        .then((data) => console.log(`Connected to DB: ${data.connection.host}`)) // Log successful connection
        .catch((err) => {
            throw err; // Throw error if connection fails
        });
};

// Function to send JWT token in a cookie and respond with user data
const sendToken = (res, user, code, message) => {
    // Create a JWT token with user ID and secret key from environment variables
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Set cookie with token and respond with success message, user data, and token
    return res.status(code)
        .cookie("Noise", token, cookieOptions)
        .json({
            success: true,
            user,
            message,
        });
};

// Export the utility functions and cookie options
export { connectDB, sendToken, cookieOptions };
