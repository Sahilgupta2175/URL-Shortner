import validUrl from "valid-url";
import URL from "../models/url.js";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

export const shortenUrl = async (req, res) => {
    const { longUrl } = req.body;
    const originalUrl = longUrl;
    console.log("Received Original URL from user: ", originalUrl);
    
    //* checking longUrl exist or not
    if(!originalUrl) {
        return res.status(400).json({success: false, message: 'Please provide a URL.'});
    }

    //* checking longUrl is valid or not. eg. http://www.google.com is valid || www.google.com is not valid
    if(!validUrl.isUri(originalUrl)) {
        return res.status(400).json({success: false, error: 'Invalid URL formate provided.'});
    }

    try {
        //* finding url is exist or not in db
        let url = await URL.findOne({originalUrl: originalUrl});
        
        if(url) {
            return res.json({success: true, data: url});
        }
        
        //* generating short url 
        const generatedShortURL = nanoid(10);

        //* adding short url with base url. eg. http://localhost:8080/s/alohslieow
        const longUrl = `${process.env.BASE_URL}/s/${generatedShortURL}`;

        //* creating object to hold new URL document
        const newURLData = {
            shortUrl: generatedShortURL,
            originalUrl: originalUrl,
            longUrl: longUrl,
        }

        if(req.user) {
            newURLData.user = req.user.id;
        }

        //* saving new url document in database.
        url = await URL.create(newURLData);

        res.status(201).json({success: true, data: url});
    } catch (error) {
        console.log('Database error.', error.message);
        return res.status(500).json({success: false, error: 'Internal Server error.'});
    }
}

export const redirectToUrl = async (req, res) => {
    //* extract short url from url. eg. haonoaid
    const { shortUrl } = req.params;
    console.log('ShortURl from Url: ', shortUrl);

    try {
        //* finding shortUrl is exist or not in db
        const url = await URL.findOne({shortUrl: shortUrl});

        if(url) {
            url.clicks++;
            await url.save();
            return res.redirect(301, url.originalUrl);
        }
        else {
            return res.status(404).json({success: false, error: 'No URL found.'});
        }
    }
    catch (error) {
        console.error('Server error on redirect.', error.message);
        res.status(500).json({success: false, error: 'Internal Server error'});
    }
}

export const generateQRCode = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        
        const url = await URL.findOne({ shortUrl: shortUrl });
        
        if (!url) {
            return res.status(404).json({ success: false, error: 'URL not found.' });
        }

        // Generate QR code as data URL
        const qrCodeDataURL = await QRCode.toDataURL(url.longUrl, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        res.status(200).json({ 
            success: true, 
            qrCode: qrCodeDataURL,
            shortUrl: url.shortUrl,
            originalUrl: url.originalUrl
        });
    } catch (error) {
        console.error('Error generating QR code:', error.message);
        res.status(500).json({ success: false, error: 'Failed to generate QR code.' });
    }
}