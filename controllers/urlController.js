const shortUrl = async (req, res) => {
    const longURL = req.body;
    
    if(!longURL) {
        return res.status(400).json({success: false, message: 'Please provide a URL.'});
    }
    else {
        console.log("Received long url from user: ", longURL);
    }

    res.status(200).json({success: true, message: "Controller is now connected.", data: { receivedUrl: longURL }});
}

export default shortUrl;