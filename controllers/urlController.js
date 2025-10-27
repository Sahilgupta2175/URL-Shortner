import validUrl from "valid-url";

const shortUrl = async (req, res) => {
    const { longUrl } = req.body;
    console.log("Received long url from user: ", longUrl);
    
    if(!longUrl) {
        return res.status(400).json({success: false, message: 'Please provide a URL.'});
    }

    if(!validUrl.isUri(longUrl)) {
        return res.status(400).json({success: false, error: 'Invalid URL formate provided.'});
    }

    res.status(200).json({success: true, message: "Controller is now connected.", data: { receivedUrl: longUrl }});
}

export default shortUrl;