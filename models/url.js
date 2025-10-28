import mongoose from "mongoose";

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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'USER',
        required: false,
    },
},{timestamp: true});

const URL = mongoose.model("URL", urlSchema);

export default URL;