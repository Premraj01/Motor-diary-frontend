import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const expenseSchema = mongoose.Schema({
	date: {
		type: Date,
	},
	driverId: {
		type: String,
	},
	department: {
		type: String,
		default: "",
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
		status: {
			type: String,
		},
	},
	expenseType: {
		type: String,
	},
	expenseReceiptImage: {
		type: String,
	},
	expenseAmount: {
		type: Number,
	},
	expenseRemark: {
		type: String,
	},
	status: {
		type: String,
	},
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
