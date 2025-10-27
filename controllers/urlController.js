import validUrl from "valid-url";
import URL from "../models/url.js";
import { nanoid } from "nanoid";

const shortUrl = async (req, res) => {
    const { longUrl } = req.body;
    console.log("Received long url from user: ", longUrl);
    
    //* checking longUrl exist or not
    if(!longUrl) {
        return res.status(400).json({success: false, message: 'Please provide a URL.'});
    }

    //* checking longUrl is valid or not. eg. http://www.google.com is valid || www.google.com is not valid
    if(!validUrl.isUri(longUrl)) {
        return res.status(400).json({success: false, error: 'Invalid URL formate provided.'});
    }

    try {
        //* finding url is exist or not in db
        let url = await URL.findOne({longUrl: longUrl});
        
        if(url) {
            return res.json({success: true, data: url});
        }
        
        const urlCode = nanoid(7);

        res.status(200).json({success: true, message: 'URL is new. Code generate successfully.', data: {urlCode: urlCode}});
    } catch (error) {
        console.log('Database error.', error.message);
        return res.status(500).json({success: false, error: 'Internal Server error.'});
    }
}

export default shortUrl;