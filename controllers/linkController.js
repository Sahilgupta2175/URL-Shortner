import URL from "../models/url.js";

export const getMyLinks = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(401).json({success: false, error: 'Authorization Denied.'});
        }

        const links = await URL.find({user: req.user.id}).sort({createdAt: -1});
        console.log(links);

        res.status(200).json({success: true, count: links.length, data: links});
    } catch (error) {
        console.error("Error fetching user links.", error.message);
        res.status(500).json({success: false, error: 'Internal Server error.'});
    }
}

export const deleteLink = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(401).json({success: false, error: 'Authorization Denied.'});
        }

        const { id } = req.params;

        // Find the URL and verify ownership
        const url = await URL.findById(id);

        if(!url) {
            return res.status(404).json({success: false, error: 'URL not found.'});
        }

        // Check if the user owns this URL
        if(url.user.toString() !== req.user.id) {
            return res.status(403).json({success: false, error: 'You are not authorized to delete this URL.'});
        }

        await URL.findByIdAndDelete(id);

        res.status(200).json({success: true, message: 'URL deleted successfully.'});
    } catch (error) {
        console.error("Error deleting link.", error.message);
        res.status(500).json({success: false, error: 'Internal Server error.'});
    }
}

export const updateLink = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(401).json({success: false, error: 'Authorization Denied.'});
        }

        const { id } = req.params;
        const { originalUrl } = req.body;

        if(!originalUrl) {
            return res.status(400).json({success: false, error: 'Original URL is required.'});
        }

        // Find the URL and verify ownership
        const url = await URL.findById(id);

        if(!url) {
            return res.status(404).json({success: false, error: 'URL not found.'});
        }

        // Check if the user owns this URL
        if(url.user.toString() !== req.user.id) {
            return res.status(403).json({success: false, error: 'You are not authorized to update this URL.'});
        }

        url.originalUrl = originalUrl;
        url.longUrl = originalUrl;
        await url.save();

        res.status(200).json({success: true, message: 'URL updated successfully.', data: url});
    } catch (error) {
        console.error("Error updating link.", error.message);
        res.status(500).json({success: false, error: 'Internal Server error.'});
    }
}