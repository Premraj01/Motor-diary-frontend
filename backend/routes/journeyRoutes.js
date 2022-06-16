import express from "express";

import {
	getJourneys,
	addJourney,
	updateJourney,
	getJourneyById,
	updateDriverReading,
	getJourneyByDriverId,
} from "../controllers/journeyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
	.route("/")
	.get(protect, getJourneys)
	.post(addJourney)
	.put(updateDriverReading);

router
	.route("/:id")
	.get(protect, getJourneyById)
	.put(updateJourney)
	.post(updateDriverReading);

router.route("/journey/:id").get(protect, getJourneyByDriverId);

export default router;
