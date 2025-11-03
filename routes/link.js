import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMyLinks, deleteLink, updateLink } from "../controllers/linkController.js";

const router = express.Router();

router.get('/my-links', authMiddleware, getMyLinks);
router.delete('/:id', authMiddleware, deleteLink);
router.put('/:id', authMiddleware, updateLink);

export default router;