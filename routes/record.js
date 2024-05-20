import express from "express";
import { newRecord, getRecordById, updateRecordById, deleteRecordById } from "../controllers/record.js";
import { isAuthenticated } from "../middlewares/auth.js";

// Create a new express Router instance
const app = express.Router();

// Middleware to check if the user is authenticated
app.use(isAuthenticated);

// Route to create a new sleep record
app.post("/sleep/", newRecord);

// Routes to handle operations on a specific sleep record by record ID
app.route("/sleep/:recordId")
    // Route to get a sleep record by its ID
    .get(getRecordById)
    // Route to update a sleep record by its ID
    .put(updateRecordById)
    // Route to delete a sleep record by its ID
    .delete(deleteRecordById);

export default app;
