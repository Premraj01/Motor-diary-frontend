import axios from "axios";
import {
	CAR_LIST_REQUEST,
	CAR_LIST_SUCCESS,
	CAR_LIST_FAIL,
	CAR_DETAILS_REQUEST,
	CAR_DETAILS_SUCCESS,
	CAR_DETAILS_FAIL,
	CAR_REGISTER_REQUEST,
	CAR_REGISTER_SUCCESS,
	CAR_REGISTER_FAIL,
	CAR_UPDATE_REQUEST,
	CAR_UPDATE_SUCCESS,
	CAR_UPDATE_FAIL,
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

export const registerCar =
	(
		carName,
		carNumber,
		carImage,
		carRCTCNo,
		carRCTCImage,
		RCNumber,
		RCBookImage,
		PUCNumber,
		PUCImage,
		PUCStartDate,
		PUCEndDate,
		insuranceNumber,
		insuranceImage,
		insuranceStartDate,
		insuranceEndDate,
		carFitnessImage,
		carFitnessStartDate,
		carFitnessEndDate,
		carPurchaseInvoice,
		carPurchaseInvoiceDate,
	) =>
	async (dispatch) => {
		try {
			dispatch({
				type: CAR_REGISTER_REQUEST,
			});

			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			console.log(carImage, PUCImage);
			const { data } = await axios.post(
				"/api/admin/cars/",
				{
					carName,
					carNumber,
					carImage,
					carRCTCNo,
					carRCTCImage,
					RCNumber,
					RCBookImage,
					PUCNumber,
					PUCImage,
					PUCStartDate,
					PUCEndDate,
					insuranceNumber,
					insuranceImage,
					insuranceStartDate,
					insuranceEndDate,
					carFitnessImage,
					carFitnessStartDate,
					carFitnessEndDate,
					carPurchaseInvoice,
					carPurchaseInvoiceDate,
				},
				config,
			);

			dispatch({
				type: CAR_REGISTER_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: CAR_REGISTER_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const getCarList =
	(keyword = "", pageNumber = "") =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: CAR_LIST_REQUEST,
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
				`/api/admin/cars?keyword=${keyword}`,
				config,
			);

			dispatch({
				type: CAR_LIST_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: CAR_LIST_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const getCarDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: CAR_DETAILS_REQUEST });

		const {
			adminLogin: { adminInfo },
		} = getState();

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${adminInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/admin/cars/${id}`, config);

		dispatch({
			type: CAR_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CAR_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const updateCar = (car) => async (dispatch) => {
	try {
		dispatch({
			type: CAR_UPDATE_REQUEST,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.put(`/api/admin/cars/${car._id}`, car, config);

		dispatch({
			type: CAR_UPDATE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CAR_UPDATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const addMaintenance = (maintenanceDetails) => async (dispatch) => {
	try {
		dispatch({
			type: CAR_ADD_MAINTENANCE_REQUEST,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.post(
			`/api/admin/cars/otherMaintenance/${maintenanceDetails.carId}`,
			maintenanceDetails,
			config,
		);

		dispatch({
			type: CAR_ADD_MAINTENANCE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CAR_ADD_MAINTENANCE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const getCarMaintenance = (carId, maintenanceId) => async (dispatch) => {
	try {
		dispatch({
			type: CAR_DETAILS_MAINTENANCE_REQUEST,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.get(
			`/api/admin/cars/otherMaintenance/${carId}/${maintenanceId}`,
			config,
		);

		dispatch({
			type: CAR_DETAILS_MAINTENANCE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CAR_DETAILS_MAINTENANCE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const updateMaintenance =
	(carId, maintenanceId, maintenance) => async (dispatch) => {
		try {
			dispatch({
				type: CAR_UPDATE_MAINTENANCE_REQUEST,
			});

			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};
			const { data } = await axios.put(
				`/api/admin/cars/otherMaintenance/${carId}/${maintenanceId}`,
				maintenance,
				config,
			);

			dispatch({
				type: CAR_UPDATE_MAINTENANCE_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: CAR_UPDATE_MAINTENANCE_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const deleteFuelWithId = (id, fuelDeleteId) => async (dispatch) => {
	try {
		dispatch({
			type: FUEL_DELETE_REQUEST,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.delete(
			`/api/admin/cars/${id}?fuel=${fuelDeleteId}`,
			config,
		);

		dispatch({
			type: FUEL_DELETE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: FUEL_DELETE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const getCarReading = (startDate, endDate, id) => async (dispatch) => {
	try {
		dispatch({
			type: CAR_READING_REQUEST,
		});
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.get(
			`/api/admin/cars/readings/${id}?endDate=${endDate}&startDate=${startDate}`,
			config,
		);
		console.log(data);
		dispatch({
			type: CAR_READING_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: CAR_READING_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
