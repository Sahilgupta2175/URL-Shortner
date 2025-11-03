// Import validation library to check if URLs are valid
import validUrl from "valid-url";
// Import URL model to interact with urls collection
import URL from "../models/url.js";
// Import nanoid to generate random short URL codes
import { nanoid } from "nanoid";
// Import QRCode library to generate QR codes
import QRCode from "qrcode";

/**
 * shortenUrl - Creates a shortened URL from a long URL
 * 
 * Process:
 * 1. Extract long URL from request body
 * 2. Validate URL is provided and has valid format
 * 3. Check if URL already exists in database (avoid duplicates)
 * 4. Generate unique short code using nanoid
 * 5. Create complete short URL with base domain
 * 6. Save to database (optionally linked to authenticated user)
 * 7. Return shortened URL data
 */
export const shortenUrl = async (req, res) => {
    // Extract the long URL from request body
    const { longUrl } = req.body;
    const originalUrl = longUrl;
    
    // Validate that URL is provided
    if(!originalUrl) {
        return res.status(400).json({success: false, message: 'Please provide a URL.'});
    }

    // Validate URL format - must include protocol (http:// or https://)
    // Example: "http://www.google.com" is valid, "www.google.com" is not
    if(!validUrl.isUri(originalUrl)) {
        return res.status(400).json({success: false, error: 'Invalid URL formate provided.'});
    }

    try {
        // Check if this URL has already been shortened before
        let url = await URL.findOne({originalUrl: originalUrl});
        
        // If URL already exists, return existing shortened URL (no need to create duplicate)
        if(url) {
            return res.json({success: true, data: url});
        }
        
        // Generate a unique random short code (10 characters)
        // Example: "aBc123XyZ9"
        const generatedShortURL = nanoid(10);

        // Create complete shortened URL by combining base URL with short code
        // Example: "http://localhost:8080/s/aBc123XyZ9"
        const longUrl = `${process.env.BASE_URL}/s/${generatedShortURL}`;

        // Prepare data object for new URL document
        const newURLData = {
            shortUrl: generatedShortURL,      // Just the short code
            originalUrl: originalUrl,          // The original long URL
            longUrl: longUrl,                  // Complete shortened URL
        }

        // If user is authenticated, link this URL to their account
        // This allows users to manage their URLs in the dashboard
        if(req.user) {
            newURLData.user = req.user.id;
        }

        // Save new URL document to database
        url = await URL.create(newURLData);

        // Return success response with the shortened URL data
        res.status(201).json({success: true, data: url});
    } catch (error) {
        // Handle any database errors
        ('Database error.', error.message);
        return res.status(500).json({success: false, error: 'Internal Server error.'});
    }
}

/**
 * redirectToUrl - Redirects short URL to original URL
 * Also tracks click count for analytics
 * 
 * Process:
 * 1. Extract short code from URL parameters
 * 2. Find URL document in database
 * 3. Increment click counter
 * 4. Redirect user to original URL
 */
export const redirectToUrl = async (req, res) => {
    // Extract short code from URL path
    // Example: If user visits /s/aBc123XyZ9, shortUrl will be "aBc123XyZ9"
    const { shortUrl } = req.params;

    try {
        // Find the URL document in database by short code
        const url = await URL.findOne({shortUrl: shortUrl});

        if(url) {
            // Increment click count for analytics
            url.clicks++;
            // Save updated click count to database
            await url.save();
            
            // Redirect user to original URL with 301 status (permanent redirect)
            return res.redirect(301, url.originalUrl);
        }
        else {
            // If short URL not found, return 404 error
            return res.status(404).json({success: false, error: 'No URL found.'});
        }
    }
    catch (error) {
        // Handle any server errors during redirect
        console.error('Server error on redirect.', error.message);
        res.status(500).json({success: false, error: 'Internal Server error'});
    }
}

/**
 * generateQRCode - Generates a QR code for a shortened URL
 * QR code can be scanned to access the short URL
 * 
 * Process:
 * 1. Extract short code from request parameters
 * 2. Find URL document in database
 * 3. Generate QR code from the short URL
 * 4. Return QR code as base64 data URL
 */
export const generateQRCode = async (req, res) => {
    try {
        // Extract short code from URL parameters
        const { shortUrl } = req.params;
        
        // Find the URL document in database
        const url = await URL.findOne({ shortUrl: shortUrl });
        
        // If URL not found, return 404 error
        if (!url) {
            return res.status(404).json({ success: false, error: 'URL not found.' });
        }

        // Generate QR code as base64 data URL (can be used directly in <img> tags)
        const qrCodeDataURL = await QRCode.toDataURL(url.longUrl, {
            errorCorrectionLevel: 'H', // High error correction (30% of code can be damaged)
            type: 'image/png',          // Output format
            quality: 0.95,              // Image quality (0-1)
            margin: 1,                  // White space around QR code
            color: {
                dark: '#000000',        // Black color for QR code modules
                light: '#FFFFFF'        // White color for background
            }
        });

        // Return success response with QR code and URL data
        res.status(200).json({ 
            success: true, 
            qrCode: qrCodeDataURL,      // Base64 encoded image
            shortUrl: url.shortUrl,      // Short code
            originalUrl: url.originalUrl // Original long URL
        });
    } catch (error) {
        // Handle errors during QR code generation
        console.error('Error generating QR code:', error.message);
        res.status(500).json({ success: false, error: 'Failed to generate QR code.' });
    }
}