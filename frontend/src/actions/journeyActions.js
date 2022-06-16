import axios from "axios";
import {
	JOURNEY_LIST_REQUEST,
	JOURNEY_LIST_SUCCESS,
	JOURNEY_LIST_FAIL,
	JOURNEY_UPDATE_REQUEST,
	JOURNEY_UPDATE_SUCCESS,
	JOURNEY_UPDATE_FAIL,
	JOURNEY_READING_REQUEST,
	JOURNEY_READING_SUCCESS,
	JOURNEY_READING_FAIL,
	JOURNEY_DETAILS_REQUEST,
	JOURNEY_DETAILS_SUCCESS,
	JOURNEY_DETAILS_FAIL,
} from "../constants/journeyConstants";

export const getJourneyList =
	(keyword = "", pageNumber = "") =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: JOURNEY_LIST_REQUEST,
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
				`/api/admin/journey?keyword=${keyword}`,
				config,
			);

			dispatch({
				type: JOURNEY_LIST_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: JOURNEY_LIST_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const getJourneyDetails =
	(id, keyword = "", startDate = "", endDate = "") =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: JOURNEY_DETAILS_REQUEST,
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
				`/api/admin/journey/${id}?keyword=${keyword}&endDate=${endDate}&startDate=${startDate}`,
				config,
			);

			dispatch({
				type: JOURNEY_DETAILS_SUCCESS,
				payload: data,
			});
		} catch (error) {
			dispatch({
				type: JOURNEY_DETAILS_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const updateJourney = (journey, status, id) => async (dispatch) => {
	try {
		dispatch({
			type: JOURNEY_UPDATE_REQUEST,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const updatedStatus = {
			car: journey.car,
			driver: journey.driver,
			journey: Object.assign({}, journey.journey, {
				status: status,
			}),
		};
		const { data } = await axios.put(
			`/api/admin/journey/${id}`,
			updatedStatus,
			config,
		);

		dispatch({
			type: JOURNEY_UPDATE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: JOURNEY_UPDATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const updateReading = (driverId) => async (dispatch) => {
	try {
		dispatch({
			type: JOURNEY_READING_REQUEST,
		});

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.post(`/api/admin/journey`, driverId, config);

		dispatch({
			type: JOURNEY_READING_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: JOURNEY_READING_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
