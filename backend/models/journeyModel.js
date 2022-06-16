import mongoose from "mongoose";

const journeySchema = mongoose.Schema({
	journey: {
		journeyDate: {
			type: Date,
		},
		journeyTime: {
			type: String,
		},
		startReading: {
			type: String,
		},
		endReading: {
			type: String,
		},
		startDestination: {
			type: String,
		},
		endDestination: {
			type: String,
		},
		status: {
			type: String,
		},
		remark: {
			type: String,
		},
		driverId: {
			type: String,
		},
	},
	driver: {
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
		photo: {
			type: String,
		},
		designation: {
			type: String,
		},
		mobileNumber: {
			type: String,
		},
		birthDate: {
			type: String,
		},
		gender: {
			type: String,
		},
		password: {
			type: String,
		},
		licence: {
			type: String,
		},
		status: {
			type: String,
			default: "active",
		},
		carId: {
			type: String,
		},
	},
	car: {
		carName: {
			type: String,
			// required: true,
		},
		carNumber: {
			type: String,
			// required: true,
		},
		carImage: {
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
		RCNumber: {
			type: String,
			// required: true,
		},
		RCBookImage: {
			type: String, //Image
			// required: true,
		},
		insuranceNumber: {
			type: String,
			// required: true,
		},
		insuranceImage: {
			type: String, //Image
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
				month: {
					type: String,
				},
				maintenance: [
					{
						date: { type: Date, required: true },
						maintenanceType: { type: String, required: true },
						amount: {
							type: Number,
							required: true,
							default: 0,
						},
					},
				],
			},
		],
	},
});

const Journey = mongoose.model("Journey", journeySchema);

export default Journey;
