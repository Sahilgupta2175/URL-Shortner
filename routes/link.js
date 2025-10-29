import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import getMyLinks from "../controllers/linkController.js";

const router = express.Router();

router.get('/my-links', authMiddleware, getMyLinks);

export default router;