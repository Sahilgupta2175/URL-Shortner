// Import User model to interact with users collection
import USER from "../models/user.js";
// Import bcrypt for password hashing (security)
import bcrypt, { genSalt } from "bcryptjs";
// Import jsonwebtoken for creating authentication tokens
import jwt from "jsonwebtoken";

/**
 * registerUser - Handles user registration
 * Creates a new user account with hashed password
 * 
 * Process:
 * 1. Extract user data from request body
 * 2. Validate all required fields are provided
 * 3. Check if user already exists
 * 4. Hash the password for security
 * 5. Create new user in database
 * 6. Return success response
 */
export const registerUser = async (req, res) => {
    try {
        // Extract name, email, and password from request body
        const {name, email, password} = req.body;

        // Validate that all required fields are provided
        if(!name || !email || !password) {
            return res.status(400).json({success: true, error: 'Please provide name, email and password.'});
        }

        // Check if a user with this email already exists in database
        const existingUser = await USER.findOne({email: email});

        if(existingUser) {
            return res.status(400).json({success: false, error: 'A user with this email already exists.'});
        }

        // Generate salt for password hashing (adds randomness for security)
        const salt = await genSalt(10);

        // Hash the password using bcrypt with the generated salt
        // This ensures passwords are never stored in plain text
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user document in database
        const newUser = await USER.create({
            name,
            email,
            password: hashedPassword, // Store hashed password, not plain text
        });

        // Send success response with user data (excluding password)
        res.status(201).json({success: true, message: 'New user created.', data: {_id: newUser._id, name: newUser.name, email: newUser.email}});
    } catch (error) {
        // Handle any unexpected errors
        console.error("Registration error.", error.message);
        res.status(500).json({success: false, error: 'Internal Server Error.'});
    }
}

/**
 * loginUser - Handles user login
 * Authenticates user credentials and generates JWT token
 * 
 * Process:
 * 1. Extract email and password from request
 * 2. Validate credentials are provided
 * 3. Find user in database and include password field
 * 4. Compare provided password with hashed password
 * 5. Generate JWT token for authenticated session
 * 6. Set token in HTTP-only cookie
 * 7. Return success response with token
 */
export const loginUser = async (req, res) => {
    try {
        // Extract email and password from request body
        const {email, password} = req.body;


        // Validate that both email and password are provided
        if(!email || !password) {
            return res.status(400).json({success: false, error: 'Please provide email and password'});
        }

        // Find user by email and explicitly include password field
        // (password is excluded by default due to select: false in schema)
        const user = await USER.findOne({email}).select('+password');

        // Verify user exists and password matches
        // bcrypt.compare compares plain text password with hashed password
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({success: false, error: 'Invalid email or password.'});
        }

        // Create JWT payload with user ID
        const payload = {
            user: {
                id: user._id,
            },
        };

        // Generate JWT token that expires in 1 hour
        // Token is signed with secret key from environment variables
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

        // Set token as HTTP-only cookie for security
        // HTTP-only cookies can't be accessed by JavaScript (prevents XSS attacks)
        res.cookie('authToken', token, {
            httpOnly: true, // Cookie not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'lax', // CSRF protection
            maxAge: 3600000, // Cookie expires in 1 hour (in milliseconds)
            path: '/' // Cookie available for all routes
        });
        
        // Send success response with token
        res.status(200).json({success: true, token: token});
    } catch (error) {
        // Handle any unexpected errors
        console.error("Login error.", error.message);
        res.status(500).json({success: false, message: 'Internal Server error.'});
    }
}