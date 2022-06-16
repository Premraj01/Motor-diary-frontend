import {
	IonApp,
	IonCol,
	IonGrid,
	IonLabel,
	IonRouterOutlet,
	IonRow,
	IonSplitPane,
	setupIonicReact,
} from "@ionic/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Menu from "./components/Menu";
import DashboardScreen from "./pages/DashoboardScreen.js";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import AddDriver from "./pages/Driver/Add-Driver/AddDriver";
import DriversList from "./pages/Driver/Drivers-list/DriversList";
import CarsList from "./pages/Car/CarList/CarsList";
import AddCar from "./pages/Car/AddCar/AddCar";
import EditCar from "./pages/Car/EditCar";
import EditDriver from "./pages/Driver/Edit-Driver/EditDriver";
import EditJourney from "./components/Journey/EditJourney/EditJourney";
import FuelMaintenance from "./pages/Maintenance/FuelMaintenance";
import Login from "./components/Login/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import OtherMaintenance from "./pages/Maintenance/other/OtherMaintenance";
import DriverHistory from "./pages/Driver/Driver-History/DriverHistory";
import CarHistory from "./pages/Car/CarHistory/CarHistory";
import AddMaintenance from "./pages/Maintenance/other/AddMaintenance";
import ExpenseList from "./pages/Expense/ExpenseList";
import EditMaintenance from "./pages/Maintenance/other/editMaintenance/EditMaintenance";

setupIonicReact();

const App = () => {
	const dispatch = useDispatch();
	const adminLogin = useSelector((state) => state.adminLogin);
	const { adminInfo } = adminLogin;

	return (
		<IonApp>
			<Router>
				<IonSplitPane contentId='main'>
					{adminInfo && <Menu />}
					<IonRouterOutlet id='main'>
						<Route
							path='/'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<DashboardScreen />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>
						<Route
							path='/admin/DriversList'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<DriversList />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>

						<Route
							path='/admin/CarsList'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<CarsList />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>
						<Route
							path='/admin/add/Driver'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<AddDriver />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>
						<Route
							path='/admin/add/Car'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<AddCar />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>

						<Route
							path='/admin/Car/:id/edit'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<EditCar />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>
						<Route
							path='/admin/Driver/:id/edit'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<EditDriver />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>
						<Route
							path='/admin/Journey/:id/edit'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<EditJourney />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>

						<Route
							path='/admin/odometer'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<FuelMaintenance />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>

						<Route
							path='/admin/carMaintenance'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<OtherMaintenance />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>
						<Route
							path='/admin/carMaintenance/add/:id'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<AddMaintenance />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>
						<Route path='/admin/login' component={Login} exact={true} />

						<Route
							path='/admin/driver/history/:id'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<DriverHistory />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>
						<Route
							path='/admin/car/history/:id'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<CarHistory />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>
						<Route
							path='/admin/car/othermaintenance/edit/:carId/:maintenanceId'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<EditMaintenance />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>

						<Route
							path='/admin/driver/history/:id/search/:keyword'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<DriverHistory />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>
						<Route
							path='/admin/ExpenseList'
							render={(props) => {
								return (
									<PrivateRoute>
										{" "}
										<ExpenseList />{" "}
									</PrivateRoute>
								);
							}}
							exact={true}
						/>
					</IonRouterOutlet>
				</IonSplitPane>
			</Router>

			{/* </IonReactRouter> */}
		</IonApp>
	);
};

export default App;
