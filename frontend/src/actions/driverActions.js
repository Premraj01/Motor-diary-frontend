import axios from "axios";
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
} from "../constants/driversConstants";

export const registerDriver =
	(
		firstName,
		lastName,
		mobileNumber,
		password,
		image,

		licence,
		licenceImage,
		designation,
		birthDate,
		carAssignedDate,
		carId,
	) =>
	async (dispatch) => {
		try {
			dispatch({
				type: DRIVER_REGISTER_REQUEST,
			});

			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};
			const { data } = await axios.post(
				"/api/admin/drivers",
				{
					firstName,
					lastName,
					mobileNumber,
					password,
					image,
					licence,
					licenceImage,
					designation,
					birthDate,
					carAssignedDate,
					carId,
				},
				config,
			);

			dispatch({
				type: DRIVER_REGISTER_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: DRIVER_REGISTER_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const getDriversList =
	(keyword = "", pageNumber = "") =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: DRIVER_LIST_REQUEST,
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
				`/api/admin/drivers?keyword=${keyword}`,
				config,
			);

			dispatch({
				type: DRIVER_LIST_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: DRIVER_LIST_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const getDriverDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: DRIVER_DETAILS_REQUEST });

		const {
			adminLogin: { adminInfo },
		} = getState();

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${adminInfo.token}`,
			},
		};

		const { data } = await axios.get(`/api/admin/drivers/${id}`, config);

		dispatch({
			type: DRIVER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: DRIVER_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const updateDriver = (driver) => async (dispatch, getState) => {
	try {
		dispatch({
			type: DRIVER_UPDATE_REQUEST,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const { data } = await axios.put(
			`/api/admin/drivers/${driver._id}`,
			driver,
			config,
		);

		dispatch({
			type: DRIVER_UPDATE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: DRIVER_UPDATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
