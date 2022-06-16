import express from "express";

import {
	addOdometerMaintenance,
	addOtherMaintenance,
	deleteFuelById,
	getCarById,
	getCarReading,
	getCars,
	getFuelByCarId,
	getMaintenance,
	registerCar,
	updateCar,
	updateMaintenance,
} from "../controllers/carControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getCars).post(registerCar);

router
	.route("/:id")
	.get(protect, getCarById)
	.put(updateCar)
	.post(addOdometerMaintenance)
	.delete(deleteFuelById);

router.route("/otherMaintenance/:id").post(addOtherMaintenance);
router.route("/readings/:id").get(getCarReading);

router.route("/fuel/:id").get(getFuelByCarId);

router
	.route("/otherMaintenance/:carId/:maintenanceId")
	.get(getMaintenance)
	.put(updateMaintenance);

export default router;
