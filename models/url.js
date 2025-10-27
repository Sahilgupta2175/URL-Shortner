import mongoose, { Mongoose } from "mongoose";

const Schema = mongoose.Schema;

const urlSchema = new Schema({
    shortUrl: {
        type: String,
        required: true,
    },
    originalUrl: {
        type: String,
        required: true,
    },
    longUrl: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
},{timestamp: true});

const URL = Mongoose.Model("URL", urlSchema);

export default URL;