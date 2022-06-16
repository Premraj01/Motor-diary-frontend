import {
	CAR_LIST_FAIL,
	CAR_LIST_REQUEST,
	CAR_LIST_SUCCESS,
	CAR_DETAILS_REQUEST,
	CAR_DETAILS_SUCCESS,
	CAR_DETAILS_FAIL,
	CAR_REGISTER_REQUEST,
	CAR_REGISTER_SUCCESS,
	CAR_REGISTER_FAIL,
	CAR_UPDATE_REQUEST,
	CAR_UPDATE_SUCCESS,
	CAR_UPDATE_FAIL,
	CAR_UPDATE_RESET,
	CAR_ADD_MAINTENANCE_REQUEST,
	CAR_ADD_MAINTENANCE_SUCCESS,
	CAR_ADD_MAINTENANCE_FAIL,
	CAR_UPDATE_MAINTENANCE_REQUEST,
	CAR_UPDATE_MAINTENANCE_SUCCESS,
	CAR_UPDATE_MAINTENANCE_FAIL,
	CAR_DETAILS_MAINTENANCE_REQUEST,
	CAR_DETAILS_MAINTENANCE_SUCCESS,
	CAR_DETAILS_MAINTENANCE_FAIL,
	FUEL_DELETE_REQUEST,
	FUEL_DELETE_SUCCESS,
	FUEL_DELETE_FAIL,
	CAR_READING_REQUEST,
	CAR_READING_SUCCESS,
	CAR_READING_FAIL,
} from "../constants/carConstants";

export const carRegisterReducer = (state = {}, action) => {
	switch (action.type) {
		case CAR_REGISTER_REQUEST:
			return { loading: true, carInfo: {} };
		case CAR_REGISTER_SUCCESS:
			return { loading: false, success: true, carInfo: action.payload };
		case CAR_REGISTER_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const carAddMaintenanceReducer = (state = {}, action) => {
	switch (action.type) {
		case CAR_ADD_MAINTENANCE_REQUEST:
			return { loading: true };
		case CAR_ADD_MAINTENANCE_SUCCESS:
			return { loading: false, success: true, maintenance: action.payload };
		case CAR_ADD_MAINTENANCE_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const carListReducer = (state = { cars: [] }, action) => {
	switch (action.type) {
		case CAR_LIST_REQUEST:
			return { loading: true, cars: [] };
		case CAR_LIST_SUCCESS:
			return {
				loading: false,
				cars: action.payload.cars,
				pages: action.payload.pages,
				page: action.payload.page,
			};
		case CAR_LIST_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const carDetailsReducer = (state = { car: {} }, action) => {
	switch (action.type) {
		case CAR_DETAILS_REQUEST:
			return { ...state, loading: true };
		case CAR_DETAILS_SUCCESS:
			return { loading: false, car: action.payload };
		case CAR_DETAILS_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};
export const carReadingReducer = (state = { reading: {} }, action) => {
	switch (action.type) {
		case CAR_READING_REQUEST:
			return { ...state, loading: true };
		case CAR_READING_SUCCESS:
			console.log(action.payload);
			return { loading: false, reading: action.payload };
		case CAR_READING_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const carUpdateReducers = (state = { car: {} }, action) => {
	switch (action.type) {
		case CAR_UPDATE_REQUEST:
			return { loading: true };
		case CAR_UPDATE_SUCCESS:
			return { loading: false, success: true, car: action.payload };
		case CAR_UPDATE_FAIL:
			return { loading: false, error: action.payload };
		case CAR_UPDATE_RESET:
			return { car: {} };
		default:
			return state;
	}
};

export const carMaintenanceDetailsReducer = (
	state = { maintenance: {} },
	action,
) => {
	switch (action.type) {
		case CAR_DETAILS_MAINTENANCE_REQUEST:
			return { loading: true };
		case CAR_DETAILS_MAINTENANCE_SUCCESS:
			return { loading: false, success: true, maintenance: action.payload };
		case CAR_DETAILS_MAINTENANCE_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const carUpdateMaintenanceReducer = (
	state = { maintenance: {} },
	action,
) => {
	switch (action.type) {
		case CAR_UPDATE_MAINTENANCE_REQUEST:
			return { loading: true };
		case CAR_UPDATE_MAINTENANCE_SUCCESS:
			return { loading: false, success: true, maintenance: action.payload };
		case CAR_UPDATE_MAINTENANCE_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const deleteFuelReducer = (state = { status: {} }, action) => {
	switch (action.type) {
		case FUEL_DELETE_REQUEST:
			return { loading: true };
		case FUEL_DELETE_SUCCESS:
			return {
				loading: false,
				success: true,
				status: action.payload,
			};
		case FUEL_DELETE_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};
