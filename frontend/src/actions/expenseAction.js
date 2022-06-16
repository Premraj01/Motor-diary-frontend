import axios from "axios";
import {
	ADD_EXPENSE_REQUEST,
	ADD_EXPENSE_SUCCESS,
	ADD_EXPENSE_FAIL,
	EXPENSE_LIST_REQUEST,
	EXPENSE_LIST_SUCCESS,
	EXPENSE_LIST_FAIL,
	EXPENSE_UPDATE_REQUEST,
	EXPENSE_UPDATE_SUCCESS,
	EXPENSE_UPDATE_FAIL,
	EXPENSE_UPDATE_DEPARTMENT_REQUEST,
	EXPENSE_UPDATE_DEPARTMENT_SUCCESS,
	EXPENSE_UPDATE_DEPARTMENT_FAIL,
} from "../constants/expenseConstants";

export const addExpense = (expense) => async (dispatch) => {
	try {
		dispatch({
			type: ADD_EXPENSE_REQUEST,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const { data } = await axios.post("/api/admin/expense", expense, config);

		dispatch({
			type: ADD_EXPENSE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: ADD_EXPENSE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const updateExpense = (expense, status, id) => async (dispatch) => {
	try {
		dispatch({
			type: EXPENSE_UPDATE_REQUEST,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const expenseStatus = {
			expense: expense,
			status: status,
		};

		const { data } = await axios.put(
			`/api/admin/expense/${id}`,
			expenseStatus,
			config,
		);

		console.log(data);

		dispatch({
			type: EXPENSE_UPDATE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: EXPENSE_UPDATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const updateExpenseDepartment = (id, department) => async (dispatch) => {
	try {
		dispatch({
			type: EXPENSE_UPDATE_DEPARTMENT_REQUEST,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const { data } = await axios.put(
			`/api/admin/expense/department/${id}?department=${department}`,
			config,
		);

		dispatch({
			type: EXPENSE_UPDATE_DEPARTMENT_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: EXPENSE_UPDATE_DEPARTMENT_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const getExpense =
	(keyword = "", startDate = "", endDate = "") =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: EXPENSE_LIST_REQUEST,
			});

			const {
				adminLogin: { adminInfo },
			} = getState();

			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminInfo.token}`,
				},
			};
			const { data } = await axios.get(
				`/api/admin/expense?keyword=${keyword}&endDate=${endDate}&startDate=${startDate}`,
				config,
			);

			dispatch({
				type: EXPENSE_LIST_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: EXPENSE_LIST_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};
