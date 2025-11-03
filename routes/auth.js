// Import Express to create router
import express from "express";
// Import authentication controller functions
import { registerUser, loginUser } from "../controllers/authController.js";

// Create router instance
const router = express.Router();

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// POST /api/auth/register - Register a new user account
// Request body: { name, email, password }
// Response: { success, message, data: { _id, name, email } }
router.post('/register', registerUser);

// POST /api/auth/login - Login existing user
// Request body: { email, password }
// Response: { success, token } + authToken cookie
router.post('/login', loginUser);

// Export router to be used in server.js
export default router;