import URL from "../models/url.js";

const getMyLinks = async (req, res) => {
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

export default getMyLinks;