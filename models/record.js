import mongoose, { Schema, model, Types } from "mongoose";

// Define the schema for the Record model
const schema = new Schema(
    {
        user: {
            type: Types.ObjectId, // MongoDB ObjectId type for referencing a User document
            ref: "User", // Reference to the User model
            required: true, // This field is required
        },
        hours: {
            type: Number, // Number of hours
            required: true, // This field is required
        },
        startTimestamp: {
            type: Date, // Date type for the start timestamp
            required: true, // This field is required
        },
        endTimestamp: {
            type: Date, // Date type for the end timestamp
            required: true, // This field is required
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt timestamps
    }
);

// Export the Record model, or if it already exists in mongoose.models, export that
export const Record = mongoose.models.Record || model("Record", schema);
