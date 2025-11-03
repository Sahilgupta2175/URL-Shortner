import express from "express";
import { shortenUrl, generateQRCode } from "../controllers/urlController.js";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();

router.post('/shorten', optionalAuthMiddleware, shortenUrl);
router.get('/qrcode/:shortUrl', generateQRCode);

export default router;