import {
	DRIVER_LIST_FAIL,
	DRIVER_LIST_REQUEST,
	DRIVER_LIST_SUCCESS,
	DRIVER_DETAILS_REQUEST,
	DRIVER_DETAILS_SUCCESS,
	DRIVER_DETAILS_FAIL,
	DRIVER_REGISTER_REQUEST,
	DRIVER_REGISTER_SUCCESS,
	DRIVER_REGISTER_FAIL,
	DRIVER_UPDATE_REQUEST,
	DRIVER_UPDATE_SUCCESS,
	DRIVER_UPDATE_FAIL,
	DRIVER_UPDATE_RESET,
} from "../constants/driversConstants";

export const driverRegisterReducer = (state = {}, action) => {
	switch (action.type) {
		case DRIVER_REGISTER_REQUEST:
			return { loading: true };
		case DRIVER_REGISTER_SUCCESS:
			return { loading: false, driverInfo: action.payload };
		case DRIVER_REGISTER_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const driversListReducer = (state = { drivers: [] }, action) => {
	switch (action.type) {
		case DRIVER_LIST_REQUEST:
			return { loading: true, drivers: [] };
		case DRIVER_LIST_SUCCESS:
			return {
				loading: false,
				drivers: action.payload.drivers,
				pages: action.payload.pages,
				page: action.payload.page,
			};
		case DRIVER_LIST_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const driversDetailsReducer = (state = { driver: {} }, action) => {
	switch (action.type) {
		case DRIVER_DETAILS_REQUEST:
			return { ...state, loading: true };
		case DRIVER_DETAILS_SUCCESS:
			return { loading: false, driver: action.payload };
		case DRIVER_DETAILS_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const driverUpdateReducers = (state = { driver: {} }, action) => {
	switch (action.type) {
		case DRIVER_UPDATE_REQUEST:
			return { loading: true };
		case DRIVER_UPDATE_SUCCESS:
			return { loading: false, success: true, driver: action.payload };
		case DRIVER_UPDATE_FAIL:
			return { loading: false, error: action.payload };
		case DRIVER_UPDATE_RESET:
			return { driver: {} };
		default:
			return state;
	}
};
