import express from "express";

import {
	authDriver,
	getDriverById,
	getDrivers,
	registerDriver,
	updateDriver,
} from "../controllers/driverControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getDrivers).post(registerDriver);

router.post("/login", authDriver);

router.route("/:id").get(getDriverById).put(updateDriver);

export default router;
