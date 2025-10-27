import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'], //? A name is mandatory. Custom error message.
    },
    email: {
        type: String,
        required: [true, 'Please provide a email'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 6,
        maxLength: 12,
        select: false,
    }
}, {timestamps: true});

const USER = mongoose.model("USER", userSchema);

export default USER;