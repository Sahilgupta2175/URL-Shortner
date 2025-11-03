// Import mongoose for database schema definition
import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * User Schema - Defines the structure of user documents in MongoDB
 * Each user has a name, email, password, and automatic timestamps
 */
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'], // Name is mandatory with custom error message
    },
    email: {
        type: String,
        required: [true, 'Please provide a email'], // Email is mandatory
        unique: true, // Ensures no duplicate emails in database
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'], // Validates email format
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'], // Password is mandatory
        minLength: 6, // Password must be at least 6 characters
        select: false, // Don't return password in queries by default (security measure)
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create User model from schema
const USER = mongoose.model("USER", userSchema);

// Export model to use in controllers
export default USER;