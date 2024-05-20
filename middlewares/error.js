// Middleware to handle errors
const errorMiddleware = (err, req, res, next) => {
    // Set default error message and status code if not provided
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
        const error = Object.keys(err.keyPattern).join(",");
        err.message = `Duplicate field - ${error}`;
        err.statusCode = 400;
    }

    // Handle Mongoose cast error (invalid ObjectId format)
    if (err.name === "CastError") {
        const errorPath = err.path;
        err.message = `Invalid Format of ${errorPath}`;
        err.statusCode = 400;
    }

    // Create error response object
    const response = {
        success: false,
        message: err.message,
    };

    // Send error response
    return res.status(err.statusCode).json(response);
};

// Wrapper function to catch and forward errors in async route handlers
const TryCatch = (passedFunc) => async (req, res, next) => {
    try {
        // Execute the passed function
        await passedFunc(req, res, next);
    } catch (error) {
        // Forward any errors to the next middleware (error handler)
        next(error);
    }
};

// Export the errorMiddleware and TryCatch functions
export { errorMiddleware, TryCatch };
