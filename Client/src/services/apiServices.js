// Import axios for making HTTP requests
import axios from "axios";

// Configure axios to include credentials (cookies) with every request
// This ensures the authToken cookie is sent with API calls
axios.defaults.withCredentials = true;

/**
 * createShortURL - Creates a shortened URL from a long URL
 * Makes POST request to /api/shorten
 * Works for both authenticated and anonymous users
 * If user is logged in, URL will be linked to their account
 * 
 * @param {string} longUrl - The original URL to shorten (must include protocol)
 * 
 * @returns {Promise<Object>} Response data: {
 *   success: boolean,
 *   data: {
 *     shortUrl: string,      // The short code (e.g., "aBc123XyZ9")
 *     originalUrl: string,   // The original URL
 *     longUrl: string,       // Complete shortened URL (e.g., "http://localhost:8080/s/aBc123XyZ9")
 *     clicks: number,        // Number of times clicked
 *     createdAt: string,     // Timestamp
 *     updatedAt: string      // Timestamp
 *   }
 * }
 * 
 * @throws {Error} If URL creation fails or network error occurs
 */
const createShortURL = async (longUrl) => {
    try {
        // Send POST request to shorten endpoint
        // Cookies (auth token) are automatically included due to withCredentials setting
        const response = await axios.post('/api/shorten', { longUrl });
        return response.data;
    } catch (error) {
        console.error('API error: Failed to create short URL.', error.message);
        
        // If server responded with error, throw the error data
        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            // Network error or unexpected error
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
}

// Export function as default export
export default createShortURL;