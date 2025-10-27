import validUrl from "valid-url";
import URL from "../models/url.js";

const shortUrl = async (req, res) => {
    const { longUrl } = req.body;
    console.log("Received long url from user: ", longUrl);
    
    if(!longUrl) {
        return res.status(400).json({success: false, message: 'Please provide a URL.'});
    }

    if(!validUrl.isUri(longUrl)) {
        return res.status(400).json({success: false, error: 'Invalid URL formate provided.'});
    }

    try {
        let url = await URL.findOne({longUrl: longUrl});
        
        if(url) {
            return res.json({success: true, data: url});
        }
        
        res.status(200).json({success: true, message: 'URL is new and valid. Ready to be shortened.'});
    } catch (error) {
        console.log('Database error.', error.message);
        return res.status(500).json({success: false, error: 'Internal Server error.'});
    }
}

export default shortUrl;