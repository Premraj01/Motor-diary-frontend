import asyncHandler from "express-async-handler";
import Driver from "../models/driverModel.js";
import Car from "../models/carModel.js";
import cron from "node-cron";
import generateToken from "../utils/generateToken.js";
import moment from "moment";

cron.schedule("* * 20 * * *", async () => {
	const driversArr = await Driver.find({});
	if (driversArr) {
		driversArr.map(async (d) => {
			if (!d.isAdmin) {
				if (moment(Date.now()).diff(d.carReadingDate, "days") > 30) {
					await Driver.findByIdAndUpdate(
						{ _id: d._id },
						{ monthlyTripReading: 0 },
					);

					if (moment(Date.now()).diff(d.carReadingDate, "days") === 30) {
						await Driver.findByIdAndUpdate(
							{ _id: d._id },
							{
								carReadingDate: moment(Date.now()).format(
									"yyyy-MM-DDTHH:mm:ss",
								),
							},
						);
					}
				}
			}
		});
	}
});

const authDriver = asyncHandler(async (req, res) => {
	const { mobileNumber, password } = req.body;

	const driver = await Driver.findOne({ mobileNumber });

	if (driver && (await driver.matchPassword(password))) {
		res.json({
			_id: driver._id,

			firstName: driver.firstName,
			lastName: driver.lastName,
			gender: driver.gender,
			licence: driver.licence,
			birthDate: driver.birthDate,
			designation: driver.designation,
			carId: driver.carId,
			mobileNumber: driver.mobileNumber,
			token: generateToken(driver._id),
		});
	} else {
		res.status(401);
		throw new Error("Invalid mobile or Password");
	}
});
//@desc Fetch all drivers
//@route GET /api/drivers
//@access Public

const getDrivers = asyncHandler(async (req, res) => {
	const keyword = req.query.keyword
		? {
				$or: [
					{ firstName: new RegExp(req.query.keyword, "i") },
					{ lastName: new RegExp(req.query.keyword, "i") },
					{ mobileNumber: new RegExp(req.query.keyword, "i") },
				],
		  }
		: {};

	const driversArr = await Driver.find({ ...keyword }).sort({ firstName: -1 });
	let drivers = [];

	if (driversArr) {
		driversArr.map(async (d) => {
			if (!d.isAdmin) {
				cron.schedule("* * * * * *", async () => {
					if (moment(Date.now()).diff(d.carReadingDate, "days") > 30) {
						await Driver.findByIdAndUpdate(
							{ _id: d._id },
							{ monthlyTripReading: 0 },
						);
					}
				});
			}
		});
	}

	if (driversArr) {
		driversArr.map((d) => {
			if (d.isAdmin === false) {
				drivers.push(d);
			}
		});
		res.json({ drivers });
	} else {
		res.status(404);
		throw new Error("Drivers error..!");
	}
});

//@desc Fetch single driver
//@route GET /api/drivers/:id
//@access Public

const getDriverById = asyncHandler(async (req, res) => {
	const driver = await Driver.findById(req.params.id);

	if (driver) {
		res.json(driver);
	} else {
		res.status(404);
		throw new Error("driver not found");
	}
});

const registerDriver = asyncHandler(async (req, res) => {
	const {
		firstName,
		lastName,
		mobileNumber,
		password,
		image,
		licence,
		licenceImage,
		designation,
		birthDate,
		carAssignedDate,
		carId,
	} = req.body;

	if (carId) {
		const car = await Car.findById(carId);

		if (car) {
			car.carStatus = true;
			const updatedCar = await car.save();
		}
	}

	const driverExists = await Driver.findOne({ mobileNumber });
	if (driverExists) {
		res.status(400).json({
			type: "Error",
			message: "Driver with this Mobile Number already exists..!",
		});
	}
	const driver = await Driver.create({
		firstName,
		lastName,
		mobileNumber,
		password,
		birthDate,
		licence,
		licenceImage,
		carAssignedDate,
		carReadingDate: carAssignedDate,
		photo: image,
		designation,
		carId: carId ? carId : null,
	});

	if (driver) {
		res.status(201).json({
			_id: driver._id,
			firstName: driver.firstName,
			lastName: driver.lastName,
			mobileNumber: driver.mobileNumber,
			licence: driver.licence,
			birthDate: driver.birthDate,
			designation: driver.designation,
		});
	} else {
		res.status(400).json({
			type: "Error",
			message: "Driver Not found..!!",
		});
	}
});

const updateDriver = asyncHandler(async (req, res) => {
	const {
		firstName,
		lastName,
		mobileNumber,
		gender,
		image,
		licenceImage,
		licence,
		birthDate,
		designation,
		carAssignedDate,
		password,
		carId,
		status,
	} = req.body;

	if (carId) {
		const car = await Car.findById(carId);

		if (car) {
			car.carStatus = true;
			const updatedCarStatus = await car.save();
		}
	}

	const driver = await Driver.findById(req.params.id);

	if (driver) {
		driver.firstName = firstName;
		driver.lastName = lastName;
		driver.photo = image;
		driver.licenceImage = licenceImage;
		driver.mobileNumber = mobileNumber;
		driver.gender = gender;
		driver.licence = licence;
		driver.password = password;
		driver.designation = designation;
		driver.birthDate = birthDate;
		driver.carAssignedDate = carAssignedDate;
		driver.carReadingDate = carAssignedDate;
		driver.carId = carId;
		driver.status = status;

		const updatedDriver = await driver.save();
	} else {
		res.status(404).json({
			type: "Error",
			message: "Driver Not found..!!",
		});
	}

	const createdDriver = await driver.save();
	res.status(201).json(driver);
});

export { getDriverById, getDrivers, registerDriver, updateDriver, authDriver };
