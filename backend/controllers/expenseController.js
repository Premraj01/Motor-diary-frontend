import asyncHandler from "express-async-handler";
import moment from "moment";
import Driver from "../models/driverModel.js";
import Expense from "../models/expenseModal.js";

const addJourneyExpense = asyncHandler(async (req, res) => {
	const driverId = req.params.id;
	const {
		date,
		expenseType,
		expenseReceiptImage,
		expenseAmount,
		expenseRemark,
	} = req.body;

	const driverData = await Driver.findById(driverId);

	const expense = await Expense.create({
		date,
		driverId: driverId,
		driver: driverData,
		expenseType,
		expenseReceiptImage,
		expenseAmount,
		expenseRemark,
		status: "pending",
	});

	if (expense) {
		res.json(expense);
	} else {
		res.status(401).json({
			type: "Error",
			message: "Cannot add expense..!",
		});
	}
});

const updateExpense = asyncHandler(async (req, res) => {
	const expenseStatus = req.body;
	const expenseUp = await Expense.findById(req.params.id);
	const driver = await Driver.findById(expenseStatus.expense.driverId);

	if (expenseUp) {
		expenseUp.date = expenseStatus.expense.date;
		expenseUp.driver = driver;
		expenseUp.department = expenseStatus.expense.department;
		expenseUp.driverId = expenseStatus.driverId;
		expenseUp.expenseType = expenseStatus.expense.expenseType;
		expenseUp.expenseReceiptImage = expenseStatus.expense.expenseReceiptImage;
		expenseUp.expenseAmount = expenseStatus.expense.expenseAmount;
		expenseUp.expenseRemark = expenseStatus.expense.expenseRemark;
		expenseUp.status = expenseStatus.status;

		const updated = await expenseUp.save();
	} else {
		res.status(404);
		throw new Error("Expense not Found");
	}
	res.status(201).json(expenseUp);
});

const getExpenseById = asyncHandler(async (req, res) => {
	const start = req.query.startDate;
	const end = req.query.endDate;

	let expenseArr;

	if (start !== "" && end !== "") {
		expenseArr = await Expense.find({
			driverId: req.params.id,
			date: {
				$gte: moment(start).toISOString(),
				$lte: moment(end).toISOString(),
			},
		});
	} else {
		expenseArr = await Expense.find({
			$or: [{ driverId: req.params.id }],
		});
	}

	if (expenseArr) {
		let expenseArr2 = [];
		expenseArr.map((ex) => {
			expenseArr2.push(ex);
		});

		res.json(expenseArr2);
	} else {
		res.status(404);
		throw new Error("Expense not found");
	}
});

const updateExpenseDepartment = asyncHandler(async (req, res) => {
	const expense = await Expense.findById(req.params.id);
	const driver = await Driver.findById(expense.driverId);

	if (expense) {
		expense.date = expense.date;
		expense.driver = driver;
		expense.department = req.query.department;
		expense.driverId = expense.driverId;
		expense.expenseType = expense.expenseType;
		expense.expenseReceiptImage = expense.expenseReceiptImage;
		expense.expenseAmount = expense.expenseAmount;
		expense.expenseRemark = expense.expenseRemark;
		expense.status = expense.status;

		const updated = await expense.save();
	} else {
		res.status(404);
		throw new Error("Expense not Found");
	}
	res.status(201).json(expense);
});

const getExpense = asyncHandler(async (req, res) => {
	let expenses;
	const start = req.query.startDate;
	const end = req.query.endDate;

	if (req.query.keyword) {
		expenses = await Expense.find(
			req.query.keyword
				? {
						$or: [
							{ "driver.firstName": new RegExp(req.query.keyword, "i") },
							{ "driver.lastName": new RegExp(req.query.keyword, "i") },
						],
				  }
				: {},
		);
	} else if (start !== "" && end !== "") {
		expenses = await Expense.find({
			date: {
				$gte: moment(start).toISOString(),
				$lte: moment(end).toISOString(),
			},
		});
	} else {
		expenses = await Expense.find({});
	}

	if (expenses) {
		res.json(expenses);
	} else {
		res.status(401).json({
			type: "Error",
			message: "Cannot fetch expenses..!",
		});
	}
});

const deleteExpenseById = asyncHandler(async (req, res) => {
	const expenseId = req.params.id;
	const expense = await Expense.findById(expenseId);

	if (expense) {
		await expense.remove();
		res.json({ message: "Expense Removed" });
	} else {
		res.status(401).json({
			type: "Error",
			message: "Cannot find expense..!",
		});
	}
});

export {
	addJourneyExpense,
	getExpense,
	updateExpense,
	getExpenseById,
	updateExpenseDepartment,
	deleteExpenseById,
};
