import {
	ADD_EXPENSE_REQUEST,
	ADD_EXPENSE_SUCCESS,
	ADD_EXPENSE_FAIL,
	EXPENSE_LIST_REQUEST,
	EXPENSE_LIST_SUCCESS,
	EXPENSE_LIST_FAIL,
} from "../constants/expenseConstants";

export const addExpenseReducer = (state = {}, action) => {
	switch (action.type) {
		case ADD_EXPENSE_REQUEST:
			return { loading: true };
		case ADD_EXPENSE_SUCCESS:
			return { loading: false, expenses: action.payload };
		case ADD_EXPENSE_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const expenseListReducer = (state = { expenses: [] }, action) => {
	switch (action.type) {
		case EXPENSE_LIST_REQUEST:
			return { loading: true, expenses: [] };
		case EXPENSE_LIST_SUCCESS:
			return {
				loading: false,
				expenses: action.payload,
			};
		case EXPENSE_LIST_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};
export const updateDepartmentReducer = (state = { expenses: {} }, action) => {
	switch (action.type) {
		case EXPENSE_LIST_REQUEST:
			return { loading: true, expenses: {} };
		case EXPENSE_LIST_SUCCESS:
			return {
				loading: false,
				success: true,
				expenses: action.payload,
			};
		case EXPENSE_LIST_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};
