// Define a custom error handler class that extends the built-in Error class
class ErrorHandler extends Error {
    // Constructor takes a message and a status code as arguments
    constructor(message, statusCode) {
        super(message); // Call the parent class (Error) constructor with the message
        this.statusCode = statusCode; // Set the status code property on the error instance
    }
}

// Export the ErrorHandler class for use in other parts of the application
export { ErrorHandler };
