import express from "express";
import { shortenUrl } from "../controllers/urlController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/shorten', authMiddleware, shortenUrl);

export default router;