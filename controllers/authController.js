import USER from "../models/user.js";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
    res.status(200).json({success: true, message: 'Auth controller is working.'});
}

export default registerUser;