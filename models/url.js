// Import mongoose for database schema definition
import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * URL Schema - Defines the structure of URL documents in MongoDB
 * Stores both short and original URLs, tracks clicks, and optionally links to a user
 */
const urlSchema = new Schema({
    shortUrl: {
        type: String,
        required: true, // The unique short code (e.g., "abc123")
    },
    originalUrl: {
        type: String,
        required: true, // The original URL that user wants to shorten (e.g., "https://google.com")
    },
    longUrl: {
        type: String,
        required: true, // The complete shortened URL with base domain (e.g., "http://localhost:8080/s/abc123")
    },
    clicks: {
        type: Number,
        required: true,
        default: 0, // Track how many times this short URL has been visited
    },
    user: {
        type: Schema.Types.ObjectId, // Reference to User model
        ref: 'USER', // Links to USER collection
        required: false, // Optional - URLs can be created without authentication
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create URL model from schema
const URL = mongoose.model("URL", urlSchema);

// Export model to use in controllers
export default URL;