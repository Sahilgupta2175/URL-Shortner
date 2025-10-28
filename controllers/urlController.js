import validUrl from "valid-url";
import URL from "../models/url.js";
import { nanoid } from "nanoid";

const shortUrl = async (req, res) => {
    const { longUrl } = req.body;
    const originalUrl = longUrl;
    console.log("Received long url from user: ", originalUrl);
    
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

        //* adding short url with base url. eg. http://localhost:8080/alohslieow
        const longUrl = `${process.env.BASE_URL}/${generatedShortURL}`;

        //* creating and saving new url document in database.
        url = await URL.create({
            shortUrl: generatedShortURL,
            originalUrl: originalUrl,
            longUrl: longUrl,
        });

        res.status(201).json({success: true, data: url});
    } catch (error) {
        console.log('Database error.', error.message);
        return res.status(500).json({success: false, error: 'Internal Server error.'});
    }
}

export default shortUrl;