import USER from "../models/user.js";
import bcrypt, { genSalt } from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        console.log(`User name is ${name}`);
        console.log(`User email is ${email}`);
        console.log(`User password is ${password}`);

        if(!name || !email || !password) {
            return res.status(400).json({success: true, error: 'Please provide name, email and password.'});
        }

        const existingUser = await USER.findOne({email: email});

        if(existingUser) {
            return res.status(400).json({success: false, error: 'A user with this email already exists.'});
        }

        const salt = await genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await USER.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({success: true, message: 'New user created.', data: {_id: newUser._id, name: newUser.name, email: newUser.email}});
    } catch (error) {
        console.error("Registration error.", error.message);
        res.status(500).json({success: false, error: 'Internal Server Error.'});
    }
}

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(`User email is ${email}`);
        console.log(`User password is ${password}`);

        if(!email || !password) {
            return res.status(400).json({success: false, error: 'Please provide email and password'});
        }

        const user = await USER.findOne({email}).select('+password');

        //* User detail mismatch while login
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({success: false, error: 'Invalid email or password.'});
        }
        
        res.status(200).json({success: true, message: 'User logged in Successfully.'});
    } catch (error) {
        console.error("Login error.", error.message);
        res.status(500).json({success: false, message: 'Internal Server error.'});
    }
}