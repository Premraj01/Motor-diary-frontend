import express from "express";
const router = express.Router();
import { authAdmin } from "../controllers/adminControllers.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/login", authAdmin);

export default router;
