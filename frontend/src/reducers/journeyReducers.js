import {
	JOURNEY_LIST_REQUEST,
	JOURNEY_LIST_SUCCESS,
	JOURNEY_LIST_FAIL,
	JOURNEY_READING_REQUEST,
	JOURNEY_READING_SUCCESS,
	JOURNEY_READING_FAIL,
	JOURNEY_DETAILS_REQUEST,
	JOURNEY_DETAILS_SUCCESS,
	JOURNEY_DETAILS_FAIL,
} from "../constants/journeyConstants";

export const journeyListReducer = (state = { journeys: [] }, action) => {
	switch (action.type) {
		case JOURNEY_LIST_REQUEST:
			return { loading: true, journeys: [] };
		case JOURNEY_LIST_SUCCESS:
			return {
				loading: false,
				journeys: action.payload.journeys,
				pendingJourneyCount: action.payload.pendingJourneyCount,
			};
		case JOURNEY_LIST_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};

export const journeyDetailsReducer = (state = { journeys: [] }, action) => {
	switch (action.type) {
		case JOURNEY_DETAILS_REQUEST:
			return { loading: true, journeys: [] };
		case JOURNEY_DETAILS_SUCCESS:
			return { loading: false, journeys: action.payload };
		case JOURNEY_DETAILS_FAIL:
			return { loading: false, error: action.payload };

		default:
			return state;
	}
};
