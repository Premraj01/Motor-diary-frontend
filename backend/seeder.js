import mongoose from "mongoose";
import dotenv from "dotenv";
import cars from "./data/car.js";
import drivers from "./data/driver.js";
import admins from "./data/admin.js";
import Admin from "./models/adminModel.js";
import Journey from "./models/journeyModel.js";
import Car from "./models/carModel.js";
import Driver from "./models/driverModel.js";
import journey from "./data/journey.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
	try {
		// const createdAdmin = await Admin.insertMany(admins);
		// console.log(createdAdmin);
		await Driver.deleteMany();
		await Car.deleteMany();
		await Journey.deleteMany();
		const createdCar = await Car.insertMany(cars);
		const sampleDriver = drivers.map((d, i) => {
			return {
				...d,
				carId: createdCar[i]?._id,
			};
		});

		const createdDriver = await Driver.insertMany(sampleDriver);

		const sampleJourney = journey.map((d, i) => {
			return {
				...d,
				driverId: createdDriver[i]?._id,
			};
		});

		const sampleJ = await Journey.insertMany(sampleJourney);
		console.log(sampleJ);
		console.log(sampleJourney);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
};

const destroyData = async () => {
	console.log("data deleted");
};

if (process.argv[2] === "-d") {
	destroyData();
} else {
	importData();
}
