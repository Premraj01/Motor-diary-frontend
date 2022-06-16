import express from "express";

import {
	addJourneyExpense,
	deleteExpenseById,
	getExpense,
	getExpenseById,
	updateExpense,
	updateExpenseDepartment,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getExpense);

router
	.route("/:id")
	.post(addJourneyExpense)
	.put(updateExpense)
	.get(getExpenseById)
	.delete(deleteExpenseById);

router.route("/department/:id").put(updateExpenseDepartment);

export default router;
