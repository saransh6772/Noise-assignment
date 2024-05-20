import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import recordRoutes from "./routes/record.js";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

const mongoURI = process.env.MONGO_URI; // MongoDB connection URI from environment variables
const port = process.env.PORT || 3000; // Server port from environment variables or default to 3000

// Connect to MongoDB database
connectDB(mongoURI);

const app = express(); // Create a new Express application

// Define a route to handle the root URL
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Middleware to parse JSON bodies in requests
app.use(express.json());
// Middleware to parse cookies in requests
app.use(cookieParser());

// Route handlers for user-related routes
app.use("/user", userRoutes);
// Route handlers for record-related routes
app.use("/record", recordRoutes);

// Middleware to handle errors
app.use(errorMiddleware);

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
