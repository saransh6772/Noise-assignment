import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js"; // Import custom error handler
import { TryCatch } from "./error.js"; // Import TryCatch wrapper for async error handling

// Middleware to check if the user is authenticated
const isAuthenticated = TryCatch((req, res, next) => {
    // Get the token from the cookies
    const token = req.cookies["Noise"];

    // If no token is found, return an error response
    if (!token) return next(new ErrorHandler("Please login to access this route", 401));

    // Verify the token using the secret key from environment variables
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user ID to the request object
    req.user = decodedData._id;

    // Proceed to the next middleware or route handler
    next();
});

// Export the isAuthenticated middleware for use in other parts of the application
export { isAuthenticated };
