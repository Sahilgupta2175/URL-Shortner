// Import axios for making HTTP requests
import axios from "axios";

// Base URL for link management endpoints
const API_URL = '/api/links';

/**
 * getUserLinks - Fetches all URLs created by the authenticated user
 * Makes GET request to /api/links/my-links
 * Requires authentication token
 * 
 * @param {string} token - JWT authentication token
 * 
 * @returns {Promise<Object>} Response data: {
 *   success: boolean,
 *   count: number,           // Total number of links
 *   data: Array<Object>      // Array of URL objects
 * }
 * 
 * @throws {Error} If request fails or user is unauthorized
 */
export const getUserLinks = async (token) => {
    // Configure request headers with Authorization token
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        // Send GET request to fetch user's links
        const response = await axios.get(API_URL + '/my-links', config);
        return response.data;   
    } catch (error) {
        console.error('API error: Failed to fetch user links.', error.message);

        // If server responded with error, throw the error data
        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            // Network error or unexpected error
            throw new Error('An unexpected error occurred while fetching links.');
        }
    }
}

/**
 * deleteLink - Deletes a specific URL by ID
 * Makes DELETE request to /api/links/:id
 * User must own the URL to delete it
 * 
 * @param {string} linkId - MongoDB ObjectId of the URL to delete
 * @param {string} token - JWT authentication token
 * 
 * @returns {Promise<Object>} Response data: {
 *   success: boolean,
 *   message: string          // Confirmation message
 * }
 * 
 * @throws {Error} If deletion fails, URL not found, or unauthorized
 */
export const deleteLink = async (linkId, token) => {
    // Configure request headers with Authorization token
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        // Send DELETE request to remove the link
        const response = await axios.delete(`${API_URL}/${linkId}`, config);
        return response.data;
    } catch (error) {
        console.error('API error: Failed to delete link.', error.message);

        // If server responded with error, throw the error data
        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            // Network error or unexpected error
            throw new Error('An unexpected error occurred while deleting link.');
        }
    }
}

/**
 * updateLink - Updates the destination URL of a shortened link
 * Makes PUT request to /api/links/:id
 * The short code remains the same, only the destination changes
 * User must own the URL to update it
 * 
 * @param {string} linkId - MongoDB ObjectId of the URL to update
 * @param {Object} updatedData - New URL data
 * @param {string} updatedData.originalUrl - New destination URL
 * @param {string} token - JWT authentication token
 * 
 * @returns {Promise<Object>} Response data: {
 *   success: boolean,
 *   message: string,         // Confirmation message
 *   data: Object            // Updated URL object
 * }
 * 
 * @throws {Error} If update fails, URL not found, or unauthorized
 */
export const updateLink = async (linkId, updatedData, token) => {
    // Configure request headers with Authorization token
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        // Send PUT request to update the link
        const response = await axios.put(`${API_URL}/${linkId}`, updatedData, config);
        return response.data;
    } catch (error) {
        console.error('API error: Failed to update link.', error.message);

        // If server responded with error, throw the error data
        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            // Network error or unexpected error
            throw new Error('An unexpected error occurred while updating link.');
        }
    }
}