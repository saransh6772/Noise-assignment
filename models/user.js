import mongoose, { Schema, model } from "mongoose";
import { hash } from "bcrypt";

// Define the schema for the User model
const schema = new Schema(
    {
        name: {
            type: String, // Name of the user
            required: true, // This field is required
        },
        username: {
            type: String, // Username of the user
            required: true, // This field is required
            unique: true, // Ensure the username is unique
        },
        password: {
            type: String, // Password of the user
            required: true, // This field is required
            select: false, // Exclude password from query results by default
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt timestamps
    }
);

// Middleware to hash the password before saving a user document
schema.pre("save", async function (next) {
    // If the password is not modified, move to the next middleware
    if (!this.isModified("password")) return next();

    // Hash the password with a salt factor of 10
    this.password = await hash(this.password, 10);

    // Proceed to the next middleware
    next();
});

// Export the User model, or if it already exists in mongoose.models, export that
export const User = mongoose.models.User || model("User", schema);
