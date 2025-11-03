// Import URL model to interact with urls collection
import URL from "../models/url.js";

/**
 * getMyLinks - Retrieves all URLs created by the authenticated user
 * Used in the dashboard to display user's shortened URLs
 * 
 * Process:
 * 1. Verify user is authenticated
 * 2. Find all URLs belonging to this user
 * 3. Sort by creation date (newest first)
 * 4. Return list of URLs with count
 */
export const getMyLinks = async (req, res) => {
    try {
        // Verify user is authenticated (should be guaranteed by authMiddleware)
        if(!req.user) {
            return res.status(401).json({success: false, error: 'Authorization Denied.'});
        }

        // Find all URLs created by this user and sort by newest first
        const links = await URL.find({user: req.user.id}).sort({createdAt: -1});
        console.log(links);

        // Return list of URLs with total count
        res.status(200).json({success: true, count: links.length, data: links});
    } catch (error) {
        // Handle any errors during database query
        console.error("Error fetching user links.", error.message);
        res.status(500).json({success: false, error: 'Internal Server error.'});
    }
}

/**
 * deleteLink - Deletes a URL created by the authenticated user
 * Includes ownership verification for security
 * 
 * Process:
 * 1. Verify user is authenticated
 * 2. Extract URL ID from request parameters
 * 3. Find URL in database
 * 4. Verify user owns this URL (security check)
 * 5. Delete URL from database
 * 6. Return success response
 */
export const deleteLink = async (req, res) => {
    try {
        // Verify user is authenticated
        if(!req.user) {
            return res.status(401).json({success: false, error: 'Authorization Denied.'});
        }

        // Extract URL ID from URL parameters
        const { id } = req.params;

        // Find the URL document in database
        const url = await URL.findById(id);

        // If URL doesn't exist, return 404 error
        if(!url) {
            return res.status(404).json({success: false, error: 'URL not found.'});
        }

        // Security check: Verify the user owns this URL
        // Prevents users from deleting URLs created by others
        if(url.user.toString() !== req.user.id) {
            return res.status(403).json({success: false, error: 'You are not authorized to delete this URL.'});
        }

        // Delete the URL document from database
        await URL.findByIdAndDelete(id);

        // Return success response
        res.status(200).json({success: true, message: 'URL deleted successfully.'});
    } catch (error) {
        // Handle any errors during deletion
        console.error("Error deleting link.", error.message);
        res.status(500).json({success: false, error: 'Internal Server error.'});
    }
}

/**
 * updateLink - Updates the original URL of a shortened link
 * The short code remains the same, only the destination URL changes
 * Includes ownership verification for security
 * 
 * Process:
 * 1. Verify user is authenticated
 * 2. Extract URL ID and new original URL from request
 * 3. Validate new URL is provided
 * 4. Find URL in database and verify ownership
 * 5. Update the original URL
 * 6. Save changes and return updated data
 */
export const updateLink = async (req, res) => {
    try {
        // Verify user is authenticated
        if(!req.user) {
            return res.status(401).json({success: false, error: 'Authorization Denied.'});
        }

        // Extract URL ID from URL parameters
        const { id } = req.params;
        // Extract new original URL from request body
        const { originalUrl } = req.body;

        // Validate that new URL is provided
        if(!originalUrl) {
            return res.status(400).json({success: false, error: 'Original URL is required.'});
        }

        // Find the URL document in database
        const url = await URL.findById(id);

        // If URL doesn't exist, return 404 error
        if(!url) {
            return res.status(404).json({success: false, error: 'URL not found.'});
        }

        // Security check: Verify the user owns this URL
        // Prevents users from updating URLs created by others
        if(url.user.toString() !== req.user.id) {
            return res.status(403).json({success: false, error: 'You are not authorized to update this URL.'});
        }

        // Update the original URL (short code stays the same)
        url.originalUrl = originalUrl;
        url.longUrl = originalUrl;
        // Save changes to database
        await url.save();

        // Return success response with updated URL data
        res.status(200).json({success: true, message: 'URL updated successfully.', data: url});
    } catch (error) {
        // Handle any errors during update
        console.error("Error updating link.", error.message);
        res.status(500).json({success: false, error: 'Internal Server error.'});
    }
}