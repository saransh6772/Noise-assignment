import { TryCatch } from "../middlewares/error.js"; // Import TryCatch wrapper for async error handling
import { Record } from "../models/record.js"; // Import Record model
import { ErrorHandler } from "../utils/utility.js"; // Import custom error handler

// Create a new record
const newRecord = TryCatch(async (req, res, next) => {
    const { hours, startTimestamp } = req.body;

    // Check for missing fields
    if (!hours || !startTimestamp) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }

    // Check for invalid hours value
    if (hours <= 0) {
        return next(new ErrorHandler("Hours must be greater than 0", 400));
    }

    // Validate startTimestamp format
    const startDate = new Date(startTimestamp);
    if (isNaN(startDate.getTime())) {
        return next(new ErrorHandler("Invalid startTimestamp format. Timestamp needs to be in ISO 8601 format", 400));
    }

    // Calculate endTimestamp based on hours
    const endTimestamp = new Date(startDate.getTime() + hours * 60 * 60 * 1000);

    // Create and save the new record
    const record = await Record.create({
        user: req.user,
        hours,
        startTimestamp,
        endTimestamp,
    });

    // Send success response
    return res.status(201).json({
        success: true,
        message: "Record created successfully",
        record,
    });
});

// Get a record by ID
const getRecordById = TryCatch(async (req, res, next) => {
    const record = await Record.findById(req.params.recordId);

    // Check if record exists
    if (!record) {
        return next(new ErrorHandler("No record with such ID exists", 404));
    }

    // Check if the user is authorized to access the record
    if (record.user.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are not authorized to access this route", 401));
    }

    // Send success response
    return res.status(200).json({
        success: true,
        record,
    });
});

// Update a record by ID
const updateRecordById = TryCatch(async (req, res, next) => {
    let record = await Record.findById(req.params.recordId);

    // Check if record exists
    if (!record) {
        return next(new ErrorHandler("No record with such ID exists", 404));
    }

    // Check if the user is authorized to update the record
    if (record.user.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are not authorized to access this route", 401));
    }

    const { hours, startTimestamp } = req.body;

    // Check for missing fields
    if (!hours || !startTimestamp) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }

    // Validate and calculate endTimestamp if hours are provided
    if (hours <= 0) {
        return next(new ErrorHandler("Hours must be greater than 0", 400));
    }
    const startDate = new Date(startTimestamp);
    if (isNaN(startDate.getTime())) {
        return next(new ErrorHandler("Invalid startTimestamp format. Timestamp needs to be in ISO 8601 format", 400));
    }
    const endTimestamp = new Date(startDate.getTime() + hours * 60 * 60 * 1000);

    // Update the record with new values
    record.hours = hours;
    record.startTimestamp = startTimestamp;
    record.endTimestamp = endTimestamp;
    await record.save();

    // Send success response
    return res.status(200).json({
        success: true,
        message: "Record updated successfully",
        record,
    });
});

// Delete a record by ID
const deleteRecordById = TryCatch(async (req, res, next) => {
    const record = await Record.findById(req.params.recordId);

    // Check if record exists
    if (!record) {
        return next(new ErrorHandler("No record with such ID exists", 404));
    }

    // Check if the user is authorized to delete the record
    if (record.user.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are not authorized to access this route", 401));
    }

    // Delete the record
    await record.deleteOne();

    // Send success response
    return res.status(200).json({
        success: true,
        message: "Record deleted successfully",
    });
});

// Export the functions
export { newRecord, getRecordById, updateRecordById, deleteRecordById };
