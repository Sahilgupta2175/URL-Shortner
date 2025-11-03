// Import dotenv to load environment variables
import dotenv from "dotenv";
dotenv.config(); // Initialize environment variables

// Import mongoose for MongoDB connection
import mongoose from "mongoose";

/**
 * connectDB - Establishes connection to MongoDB database
 * Uses connection string from environment variable MONGO_ATLAS_URL
 * If connection fails, the process will exit with error code 1
 */
const connectDB = async () => {
    try {
        // Connect to MongoDB using connection string from .env file
        await mongoose.connect(process.env.MONGO_ATLAS_URL).then(() => {
            ("MongoDB connected Successfully.");
        });
    } catch (error) {
        // Log error message if connection fails
        (error.message);
        // Exit the application with failure code
        process.exit(1);
    }
}

// Export the connection function to be used in server.js
export default connectDB;