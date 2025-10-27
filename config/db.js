import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_ATLAS_URL).then(() => {
            console.log("MongoDB connected Successfully.");
        });
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDB;