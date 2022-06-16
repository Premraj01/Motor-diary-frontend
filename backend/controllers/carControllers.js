import asyncHandler from "express-async-handler";
import moment from "moment";
import Car from "../models/carModel.js";
import Journey from "../models/journeyModel.js";

const registerCar = asyncHandler(async (req, res) => {
  const {
    carName,
    carNumber,
    carImage,
    carRCTCNo,
    carRCTCImage,
    RCNumber,
    RCBookImage,
    PUCNumber,
    PUCImage,
    PUCStartDate,
    PUCEndDate,
    insuranceNumber,
    insuranceImage,
    insuranceStartDate,
    insuranceEndDate,
    carFitnessImage,
    carFitnessStartDate,
    carFitnessEndDate,
    carPurchaseInvoice,
    carPurchaseInvoiceDate,
  } = req.body;

  const carExists = await Car.findOne({ carNumber });
  if (carExists) {
    res.status(400).json({
      type: "Error",
      message: "Car with this Number already exists..!",
    });
    // throw new Error({ message: "Car with this Number already exists" });
  }
  const car = await Car.create({
    carName,
    carNumber,
    carImage,
    carRCTCNo,
    carRCTCImage,
    RCNumber,
    RCBookImage,
    PUCNumber,
    PUCImage,
    PUCStartDate,
    PUCEndDate,
    insuranceNumber,
    insuranceImage,
    insuranceStartDate,
    insuranceEndDate,
    carFitnessImage,
    carFitnessStartDate,
    carFitnessEndDate,
    carPurchaseInvoice,
    carPurchaseInvoiceDate,
  });
  if (car) {
    res.status(201).json({
      _id: car._id,
      carName: car.carName,
      carNumber: car.carNumber,
      PUCNumber: car.PUCNumber,
      RCNumber: car.RCNumber,
      insuranceNumber: car.insuranceNumber,
    });
  } else {
    res.status(400);
    throw new Error("Invalid car data");
  }
});

//@desc Fetch all cars
//@route GET /api/cars
//@access Public

const getCars = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { carName: new RegExp(req.query.keyword, "i") },
          { carNumber: new RegExp(req.query.keyword, "i") },
        ],
      }
    : {};

  const cars = await Car.find({ ...keyword });

  res.json({ cars });
});

//@desc Fetch single car
//@route GET /api/cars/:id
//@access Public

const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (car) {
    res.json(car);
  } else {
    res.status(404);
    throw new Error("Car not found");
  }
});

const updateCar = asyncHandler(async (req, res) => {
  const {
    carName,
    carNumber,
    carImage,
    carRCTCNo,
    carRCTCImage,
    carStatus,
    RCNumber,
    RCBookImage,
    PUCNumber,
    PUCImage,
    PUCStartDate,
    PUCEndDate,
    insuranceNumber,
    insuranceImage,
    insuranceStartDate,
    insuranceEndDate,
    carFitnessImage,
    carFitnessStartDate,
    carFitnessEndDate,
    carPurchaseInvoice,
    carPurchaseInvoiceDate,
  } = req.body;

  const car = await Car.findById(req.params.id);
  if (car) {
    car.carName = carName;
    car.carNumber = carNumber;
    car.carImage = carImage;
    car.carRCTCNo = carRCTCNo;
    car.carRCTCImage = carRCTCImage;
    car.RCBookImage = RCBookImage;
    car.PUCNumber = PUCNumber;
    car.PUCImage = PUCImage;
    car.PUCStartDate = PUCStartDate;
    car.PUCEndDate = PUCEndDate;
    car.RCNumber = RCNumber;
    car.carStatus = carStatus;
    car.insuranceNumber = insuranceNumber;
    car.insuranceImage = insuranceImage;
    car.insuranceStartDate = insuranceStartDate;
    car.insuranceEndDate = insuranceEndDate;
    car.carFitnessImage = carFitnessImage;
    car.carFitnessStartDate = carFitnessStartDate;
    car.carFitnessEndDate = carFitnessEndDate;
    car.carPurchaseInvoice = carPurchaseInvoice;
    car.carPurchaseInvoiceDate = carPurchaseInvoiceDate;

    const updatedCar = await car.save();
  } else {
    res.status(404);
    throw new Error("Car not Found");
  }

  res.status(201).json(car);
});

const addOdometerMaintenance = asyncHandler(async (req, res) => {
  const {
    maintenanceType,
    date,
    odometerImage,
    fuelReceiptImage,
    fuelBillReceiptCopyImage,
    odometerReading,
    amount,
    time,
    quantity,
  } = req.body;

  const car = await Car.findById(req.params.id);
  const odometer = {
    date: date,
    reading: odometerReading,
    amount: amount,
    time: time,
    quantity: quantity,
    fuelBillReceiptCopyImage: fuelBillReceiptCopyImage,
    odometerImage: odometerImage,
    maintenanceType: maintenanceType,
    fuelReceiptImage: fuelReceiptImage,
  };
  if (car) {
    car.fuelMaintenance.push(odometer);
    await car.save();
  } else {
    res.status(404);
    throw new Error("Car not Found");
  }
  res.status(201).json(car);
});

const addOtherMaintenance = asyncHandler(async (req, res) => {
  const {
    date,
    reading,
    paymentMode,
    servicingCenterName,
    CGST,
    SGST,
    totalAmount,
    invoiceNumber,
    maintenanceTypes,
    // driverId,
  } = req.body;

  const car = await Car.findById(req.params.id);
  // const driver = await Driver.findById(driverId);
  const odometer = {
    date: date,
    reading: reading,
    paymentMode: paymentMode,
    SGST: SGST,
    CGST: CGST,
    invoiceNumber: invoiceNumber,
    totalAmount: totalAmount,
    servicingCenterName: servicingCenterName,
    maintenances: maintenanceTypes,
    // driverdriverId
  };
  if (car) {
    car.carMaintenance.push(odometer);
    await car.save();
  } else {
    res.status(404);
    throw new Error("Car not Found");
  }
  res.status(201).json(car);
});

const getMaintenance = asyncHandler(async (req, res) => {
  const { carId, maintenanceId } = req.params;

  const car = await Car.findById(carId);
  if (car) {
    car.carMaintenance.forEach((main) => {
      if (main._id == maintenanceId.toString()) {
        res.json(main);
      }
    });
  } else {
    res.status(404);
    throw new Error("Car not Found");
  }
});

const updateMaintenance = asyncHandler(async (req, res) => {
  const { carId, maintenanceId } = req.params;
  const maintenance = req.body;

  const car = await Car.findById(carId);
  if (car) {
    car.carName = car.carName;
    car.carNumber = car.carNumber;
    car.carImage = car.carImage;
    car.carRCTCNo = car.carRCTCNo;
    car.carRCTCImage = car.carRCTCImage;
    car.RCBookImage = car.RCBookImage;
    car.PUCNumber = car.PUCNumber;
    car.PUCImage = car.PUCImage;
    car.PUCStartDate = car.PUCStartDate;
    car.PUCEndDate = car.PUCEndDate;
    car.RCNumber = car.RCNumber;
    car.carStatus = car.carStatus;
    car.insuranceNumber = car.insuranceNumber;
    car.insuranceImage = car.insuranceImage;
    car.insuranceStartDate = car.insuranceStartDate;
    car.insuranceEndDate = car.insuranceEndDate;
    car.carFitnessImage = car.carFitnessImage;
    car.carFitnessStartDate = car.carFitnessStartDate;
    car.carFitnessEndDate = car.carFitnessEndDate;
    car.carPurchaseInvoice = car.carPurchaseInvoice;
    car.carPurchaseInvoiceDate = car.carPurchaseInvoiceDate;
    car.carMaintenance.forEach((main, i) => {
      if (main._id == maintenanceId.toString()) {
        car.carMaintenance[i].date = maintenance.date;
        car.carMaintenance[i].servicingCenterName =
          maintenance.servicingCenterName;
        car.carMaintenance[i].reading = maintenance.reading;
        car.carMaintenance[i].invoiceNumber = maintenance.invoiceNumber;
        car.carMaintenance[i].SGST = maintenance.SGST;
        car.carMaintenance[i].CGST = maintenance.CGST;
        car.carMaintenance[i].paymentMode = maintenance.paymentMode;
        car.carMaintenance[i].maintenance = maintenance.maintenances;
      }
    });

    const updatedCar = await car.save();
  }
});

const deleteFuelById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const fuelId = req.query.fuel;

  // const car = await Car.findById(id)
  const car = await Car.updateOne(
    { "fuelMaintenance._id": fuelId },
    {
      $pull: { fuelMaintenance: { _id: fuelId } },
    }
  );
});

// For Mobile View

const getFuelByCarId = asyncHandler(async (req, res) => {
  const carId = req.params.id;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const car = await Car.findById(carId);

  if (car) {
    let filteredFuel = [];
    if (startDate !== "" && endDate !== "") {
      car.fuelMaintenance.map((fuel) => {
        if (
          moment(startDate).format("yyyy-MM-DDTHH:mm:ss") <=
          moment(fuel.date).format("yyyy-MM-DDTHH:mm:ss")
        ) {
          if (
            moment(endDate).format("yyyy-MM-DDTHH:mm:ss") >=
            moment(fuel.date).format("yyyy-MM-DDTHH:mm:ss")
          ) {
            filteredFuel.push(fuel);
          }
        }
      });
      res.json(filteredFuel);
    } else {
      let fuel = [...car.fuelMaintenance];
      res.json(fuel);
    }
  } else {
    res.status(404);
    throw new Error("Car not Found");
  }
});

const getCarReading = asyncHandler(async (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const journey = await Journey.find({
    $and: [
      { "driver.carId": new RegExp(req.params.id, "i") },
      {
        "journey.journeyDate": {
          $gte: moment(startDate).toISOString(),
          $lte: moment(endDate).toISOString(),
        },
      },
    ],
  });

  console.log(
    journey[0].journey.startReading,
    journey[journey.length - 1].journey.endReading
  );

  const readings = {
    startReading: parseInt(journey[0].journey.startReading),
    endReading: parseInt(journey[journey.length - 1].journey.endReading),
  };

  res.json({ readings });
});

export {
  getCarById,
  getCars,
  registerCar,
  updateCar,
  addOdometerMaintenance,
  addOtherMaintenance,
  getMaintenance,
  updateMaintenance,
  getFuelByCarId,
  deleteFuelById,
  getCarReading,
};
