import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
	driversListReducer,
	driversDetailsReducer,
	driverRegisterReducer,
	driverUpdateReducers,
} from "./reducers/driverReducers";
import {
	carListReducer,
	carDetailsReducer,
	carRegisterReducer,
	carUpdateReducers,
	carAddMaintenanceReducer,
	carMaintenanceDetailsReducer,
	carUpdateMaintenanceReducer,
	carReadingReducer,
	deleteFuelReducer,
} from "./reducers/carReducers";
import {
	journeyDetailsReducer,
	journeyListReducer,
} from "./reducers/journeyReducers";
import {
	addExpenseReducer,
	deleteExpenseReducer,
	expenseListReducer,
	updateDepartmentReducer,
} from "./reducers/expenseReducer";
import { adminLoginReducer } from "./reducers/adminReducers";

const reducer = combineReducers({
	driversList: driversListReducer,
	driverDetails: driversDetailsReducer,
	carList: carListReducer,
	carDetails: carDetailsReducer,
	carAddMaintenance: carAddMaintenanceReducer,
	journeyList: journeyListReducer,
	journeyDetails: journeyDetailsReducer,
	driverRegister: driverRegisterReducer,
	carRegister: carRegisterReducer,
	driverUpdate: driverUpdateReducers,
	carUpdate: carUpdateReducers,
	adminLogin: adminLoginReducer,
	addExpense: addExpenseReducer,
	expenseList: expenseListReducer,
	carMaintenanceDetails: carMaintenanceDetailsReducer,
	carUpdateMaintenance: carUpdateMaintenanceReducer,
	carReading: carReadingReducer,
	deleteFuel: deleteFuelReducer,
	updateDepartment: updateDepartmentReducer,
});

const adminInfoFromStorage = localStorage.getItem("adminInfo")
	? JSON.parse(localStorage.getItem("adminInfo"))
	: null;

const initialState = {
	adminLogin: {
		adminInfo: adminInfoFromStorage,
	},
};

const middleware = [thunk];

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;
