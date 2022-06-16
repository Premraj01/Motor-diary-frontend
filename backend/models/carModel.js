import mongoose from "mongoose";

const carSchema = mongoose.Schema({
	carName: {
		type: String,
	},
	carNumber: {
		type: String,
	},
	carImage: {
		type: String,
	},
	carRCTCNo: {
		type: String,
		// required: true,
	},
	carRCTCImage: {
		type: String,
		// required: true,
	},
	RCNumber: {
		type: String,
		// required: true,
	},
	RCBookImage: {
		type: String,
		// required: true,
	},
	PUCNumber: {
		type: String,
		// required: true,
	},
	PUCImage: {
		type: String,
		// required: true,
	},
	PUCStartDate: {
		type: String,
		// required: true,
	},
	PUCEndDate: {
		type: String,
		// required: true,
	},
	insuranceNumber: {
		type: String,
		// required: true,
	},
	insuranceImage: {
		type: String,
		// required: true,
	},
	insuranceStartDate: {
		type: String,
		// required: true,
	},
	insuranceEndDate: {
		type: String,
		// required: true,
	},
	carFitnessImage: {
		type: String,
		// required: true,
	},
	carFitnessStartDate: {
		type: String,
		// required: true,
	},
	carFitnessEndDate: {
		type: String,
		// required: true,
	},
	carPurchaseInvoice: {
		type: String,
		// required: true,
	},
	carPurchaseInvoiceDate: {
		type: String,
		// required: true,
	},
	carStatus: {
		type: Boolean,
		default: false, //false => free(inActive) , true => busy(active)
		required: true,
	},
	reading: [
		{
			date: {
				type: Date,
			},
			startReading: {
				type: Number,
			},
			endReading: {
				type: Number,
			},
		},
	],
	fuelMaintenance: [
		{
			maintenanceType: {
				type: String,
			},
			date: {
				type: Date,
			},
			odometerImage: {
				type: String,
			},
			fuelBillReceiptCopyImage: { type: String },
			fuelReceiptImage: {
				type: String,
			},
			reading: {
				type: Number,

				default: 0,
			},
			amount: {
				type: Number,

				default: 0,
			},

			quantity: {
				type: Number,
			},
			time: { type: String },
		},
	],
	carMaintenance: [
		{
			date: {
				type: Date,
			},
			reading: {
				type: Number,
				default: 0,
			},
			paymentMode: {
				type: String,
			},
			servicingCenterName: {
				type: String,
			},
			CGST: {
				type: Number,
				default: 0,
			},
			invoiceNumber: {
				type: String,
			},
			SGST: {
				type: Number,
				default: 0,
			},
			totalAmount: {
				type: Number,
				default: 0,
			},
			maintenances: [
				{
					type: {
						type: String,
					},

					basicAmount: {
						type: Number,
						default: 0,
					},
				},
			],
		},
	],
});

const Car = mongoose.model("Car", carSchema);

export default Car;
