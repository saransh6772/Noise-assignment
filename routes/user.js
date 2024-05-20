import express from "express";
import { newUser, login, logout, deleteUserById, updateUserById, getUserRecordsByID } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

// Create a new express Router instance
const app = express.Router();

// Public routes (No authentication required)

// Route to create a new user
app.post("/new", newUser);

// Route to log in a user
app.post("/login", login);

// Middleware to check if the user is authenticated
app.use(isAuthenticated);

// Protected routes (Authentication required)

// Route to log out a user
app.get("/logout", logout);

// Routes to handle sleep records by user ID
app.route("/sleep/:userId")
    // Route to delete a user by ID
    .delete(deleteUserById)
    // Route to update a user by ID
    .put(updateUserById)
    // Route to get sleep records of a user by ID
    .get(getUserRecordsByID);

export default app;
