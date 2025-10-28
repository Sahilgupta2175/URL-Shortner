import express from "express";

const router = express.Router();

router.get('/:shortUrl', (req, res) => {
    const {shortUrl} = req.params;
    console.log(shortUrl);

    res.status(200).json({success: true, message: 'Redirect route is working.', data: {capturedShortUrl: shortUrl}});
});

export default router;