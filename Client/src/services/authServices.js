// Import axios for making HTTP requests
import axios from "axios";
// Import API base URL configuration
import API_BASE_URL from "../config/api.js";

// Base URL for authentication endpoints
const API_URL = `${API_BASE_URL}/api/auth/`;

/**
 * registerUser - Registers a new user account
 * Makes POST request to /api/auth/register
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password (min 6 characters)
 * 
 * @returns {Promise<Object>} Response data: { success, message, data: { _id, name, email } }
 * @throws {Error} If registration fails or network error occurs
 */
export const registerUser = async (userData) => {
    try {
        // Send POST request to register endpoint
        const response = await axios.post(API_URL + 'register', userData);
        return response.data;
    } catch (error) {
        console.error('API error: User registration failed', error.message);

        // If server responded with error, throw the error data
        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            // Network error or unexpected error
            throw new Error('An unexpected error occurred during registration.');
        }
    }
}

/**
 * loginUser - Authenticates user and returns JWT token
 * Makes POST request to /api/auth/login
 * 
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * 
 * @returns {Promise<Object>} Response data: { success, token }
 * @throws {Error} If login fails or network error occurs
 */
export const loginUser = async (credentials) => {
    try {
        // Send POST request to login endpoint
        const response = await axios.post(API_URL + 'login', credentials);
        return response.data;
    } catch (error) {
        console.error('API error: User login failed', error.message);
        
        // If server responded with error, throw the error data
        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            // Network error or unexpected error
            throw new Error('An unexpected error occurred during login.');
        }
    }
}
