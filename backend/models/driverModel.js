import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const driverSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		photo: {
			type: String,
		},
		designation: {
			type: String,
		},
		mobileNumber: {
			type: String,
			required: true,
			unique: true,
		},
		birthDate: {
			type: String,
		},

		password: {
			type: String,
			required: true,
		},
		licence: {
			type: String,
		},
		licenceImage: {
			type: String,
		},
		status: {
			type: String,
			default: "active",
		},
		monthlyTripReading: {
			type: Number,
			default: 0,
		},
		carId: {
			type: String,
		},
		carAssignedDate: {
			type: Date,
		},
		carReadingDate: {
			type: Date,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

driverSchema.methods.matchPassword = async function (enteredPassword) {
	if (enteredPassword === this.password) {
		return true;
	} else {
		return false;
	}
};

// driverSchema.pre("save", async function (next) {
// 	if (!this.isModified("password")) {
// 		next();
// 	}

// 	const salt = await bcrypt.genSalt(10);
// 	this.password = await bcrypt.hash(this.password, salt);
// });

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
