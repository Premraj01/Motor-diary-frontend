import asyncHandler from "express-async-handler";
import Journey from "../models/journeyModel.js";
import Driver from "../models/driverModel.js";
import Car from "../models/carModel.js";
import moment from "moment";

//@desc Fetch all drivers
//@route GET /api/drivers
//@access Public

const getJourneys = asyncHandler(async (req, res) => {
	const journeys = await Journey.find(
		req.query.keyword
			? {
					$or: [
						{ "driver.mobileNumber": new RegExp(req.query.keyword, "i") },
						{ "driver.firstName": new RegExp(req.query.keyword, "i") },
						{ "driver.lastName": new RegExp(req.query.keyword, "i") },
					],
			  }
			: {},
	);
	let pendingJourneyCount = 0;
	journeys.map((j) => {
		if (j.journey.status === "pending") {
			pendingJourneyCount++;
		}
	});

	res.json({ journeys, pendingJourneyCount });
});

const addJourney = asyncHandler(async (req, res) => {
	const {
		driverId,
		journeyDate,
		journeyTime,
		startReading,
		endReading,
		startDestination,
		endDestination,
		remark,
	} = req.body;

	const driverData = await Driver.findById(driverId);
	const car = await Car.findById(driverData.carId);

	const month = moment(journeyDate).format("M");
	const year = moment(journeyDate).format("YYYY");

	if (car) {
		let flag = false;
		if (car.reading.length === 0) {
			const newReading = {
				date: journeyDate,
				startReading: startReading,
				endReading: endReading,
			};

			car.reading.push(newReading);
		} else {
			for (let i = 0; i < car.reading.length; i++) {
				if (
					month === moment(car.reading[i].date).format("M") &&
					year === moment(car.reading[i].date).format("YYYY")
				) {
					flag = true;
					car.reading[i].endReading = endReading;
					break;
				}
			}
			if (!flag) {
				const newReading = {
					date: journeyDate,
					startReading: startReading,
					endReading: endReading,
				};
				car.reading.push(newReading);
			}
		}
		const updatedCar = await car.save();
	}

	const carData = await Car.findById(driverData.carId);

	const journey = await Journey.create({
		journey: {
			driverId,
			journeyDate,
			journeyTime,
			startReading,
			endReading,
			startDestination,
			endDestination,
			status: "pending",
			remark,
		},
		driver: driverData,
		car: carData,
	});

	res.json(journey);
});

const getJourneyById = asyncHandler(async (req, res) => {
	const start = req.query.startDate;
	const end = req.query.endDate;

	let journeyArr;

	if (start !== "" && end !== "") {
		journeyArr = await Journey.find({
			$or: [
				{ "journey.driverId": req.params.id },
				{ "driver.carId": req.params.id },
			],

			"journey.journeyDate": {
				$gte: moment(start).toISOString(),
				$lte: moment(end).toISOString(),
			},
		});
	} else {
		journeyArr = await Journey.find({
			$or: [
				{ "journey.driverId": req.params.id },
				{ "driver.carId": req.params.id },
			],
		});
	}
	if (journeyArr) {
		res.json(journeyArr);
	} else {
		res.status(401).json({
			type: "Error",
			message: "Cannot fetch Journey..!",
		});
	}
});

const getJourneyByDriverId = asyncHandler(async (req, res) => {
	const start = req.query.startDate;
	const end = req.query.endDate;

	let journeyArr;

	if (start !== "" && end !== "") {
		journeyArr = await Journey.find({
			$or: [
				{ "journey.driverId": req.params.id },
				{ "driver.carId": req.params.id },
			],

			"journey.journeyDate": {
				$gte: moment(start).toISOString(),
				$lte: moment(end).toISOString(),
			},
		});
	} else {
		journeyArr = await Journey.find({
			$or: [
				{ "journey.driverId": req.params.id },
				{ "driver.carId": req.params.id },
			],
		});
	}

	if (journeyArr) {
		let journeyArr2 = [];
		journeyArr.map((j) => {
			journeyArr2.push(j.journey);
		});

		res.json(journeyArr2);
	} else {
		res.status(404);
		throw new Error("Journey not found");
	}
});

const updateJourney = asyncHandler(async (req, res) => {
	const updatedStatus = req.body;
	const driverData = await Driver.findById(updatedStatus.journey.driverId);
	const journeyUp = await Journey.findById(req.params.id);
	const carData = await Car.findById(driverData.carId);

	if (journeyUp) {
		journeyUp.driver = driverData;
		journeyUp.car = carData;
		journeyUp.journey.journeyDate = updatedStatus.journey.journeyDate;
		journeyUp.journey.journeyTime = updatedStatus.journey.journeyTime;
		journeyUp.journey.startReading = updatedStatus.journey.startReading;
		journeyUp.journey.endReading = updatedStatus.journey.endReading;
		journeyUp.journey.expenseType = updatedStatus.journey.expenseType;
		journeyUp.journey.startDestination = updatedStatus.journey.startDestination;
		journeyUp.journey.endDestination = updatedStatus.journey.endDestination;
		journeyUp.journey.expenseAmount = updatedStatus.journey.expenseAmount;
		journeyUp.journey.remark = updatedStatus.journey.remark;
		journeyUp.journey.status = updatedStatus.journey.status;

		await journeyUp.save();
		const journeys = await Journey.find();
		// if(driverData){
		// 	driverData.carAssignedDate
		// }
		let totalReadingOfDriver = 0;
		journeys.forEach((j) => {
			if (j.journey.driverId === updatedStatus.journey.driverId) {
				if (j.journey.status === "accepted") {
					let curReading = j.journey.endReading - j.journey.startReading;
					totalReadingOfDriver = curReading + totalReadingOfDriver;
				}
			}
		});
		const driver = await Driver.findById(updatedStatus.journey.driverId);

		if (driver) {
			driver.firstName = driver.firstName;
			driver.lastName = driver.lastName;
			driver.mobileNumber = driver.mobileNumber;
			driver.gender = driver.gender;
			driver.licence = driver.licence;
			driver.password = driver.password;
			driver.designation = driver.designation;
			driver.birthDate = driver.birthDate;
			driver.carId = driver.carId;
			driver.status = driver.status;
			driver.monthlyTripReading = totalReadingOfDriver;

			await driver.save();
		}
	} else {
		res.status(404);
		throw new Error("Trip not Found");
	}

	res.status(201).json(journeyUp);
});

const updateDriverReading = asyncHandler(async (req, res) => {
	const { driverId } = req.body;
	const driver = await Driver.findById(driverId);
	if (driver) {
		const journeyReading = await Journey.find({
			status: "accepted",
			driverId: driverId,
		});
		driver.totalTrip = journeyReading.length;
		if (journeyReading.length > 0) {
			let totalTripReading = 0;
			journeyReading.map((j) => {
				let cur = j.endReading - j.startReading;

				totalTripReading = totalTripReading + cur;
			});
			driver.totalTripReading = totalTripReading;
		}
		const updatedDriver = await driver.save();
		res.json(updatedDriver);
	} else {
		res.status(404);
		throw new Error("Driver not Found");
	}
});

export {
	getJourneys,
	addJourney,
	updateJourney,
	getJourneyById,
	updateDriverReading,
	getJourneyByDriverId,
};
