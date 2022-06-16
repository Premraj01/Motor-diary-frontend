import React, { useEffect, useState } from "react";
import "./DriversTable.css";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCarList } from "../../actions/carActions";
import { getDriversList } from "../../actions/driverActions";
import {
	IonButton,
	IonCard,
	IonCol,
	IonGrid,
	IonIcon,
	IonLabel,
	IonRow,
} from "@ionic/react";
import { addCircleSharp } from "ionicons/icons";

const DriversTable = () => {
	const dispatch = useDispatch();
	const { keyword, pageNumber } = useParams();
	const [showModal, setShowModal] = useState(false);
	const [driver, setDriver] = useState([]);
	let driverArr = [];

	const driversList = useSelector((state) => state.driversList);
	const { loading, error, drivers } = driversList;

	const carList = useSelector((state) => state.carList);
	const { loading: carListLoading, error: carListError, cars } = carList;

	useEffect(() => {
		drivers.map((d) => {
			if (d.monthlyTripReading > 1150) {
				driverArr.push(d);
				setDriver([...driverArr]);
				setShowModal(true);
			}
		});
		dispatch(() => getDriversList());
		dispatch(getCarList());
	}, [dispatch, pageNumber, drivers]);

	return (
		<>
			{drivers.length !== 0 && (
				<>
					<IonCard class='blue-border'>
						<IonGrid no-padding>
							<IonRow class=' ml-20 mr-20'>
								<IonCol className='ion-align-self-center'>
									<IonLabel className='spx-font-16 spx-bold spx-font-color-black'>
										Drivers
									</IonLabel>{" "}
								</IonCol>
								<IonCol>
									<Link to='/admin/add/Driver'>
										<IonButton className='ion-float-right'>
											Add Driver{" "}
											<IonIcon
												slot='end'
												ios={addCircleSharp}
												md={addCircleSharp}
											/>
										</IonButton>
									</Link>
								</IonCol>
							</IonRow>
							<div className='table-header ml-20 mr-20'>
								<div className='hr'></div>
								<IonRow className='spx-bold spx-color-white'>
									<IonCol className='spx-bold '>Name</IonCol>
									<IonCol className='spx-bold '>Contact Number</IonCol>
									<IonCol className='spx-bold '>Assigned Car</IonCol>
								</IonRow>
								<div className='hr'></div>
							</div>
							{drivers.map((driver, i) => {
								if (i < 4) {
									return (
										<div className='ml-20 mr-20'>
											<IonRow
												className='ion-align-self-center table spx-font-color-black'
												key={driver._id}>
												<IonCol>
													{driver.firstName}
													{driver.lastName}
												</IonCol>
												<IonCol>{driver.mobileNumber}</IonCol>
												{driver.carId ? (
													cars.map(
														(car) =>
															driver.carId === car._id && (
																<IonCol key={car._id}>{car.carName}</IonCol>
															),
													)
												) : (
													<IonCol>-</IonCol>
												)}
											</IonRow>
											<div className='hr'></div>
										</div>
									);
								}
							})}
							<IonRow className='ion-align-self-center ion-text-center'>
								<IonCol></IonCol>
								<IonCol></IonCol>

								<IonCol>
									<Link to='/admin/DriversList'>
										<IonLabel>View All</IonLabel>
									</Link>
								</IonCol>
							</IonRow>
						</IonGrid>
					</IonCard>
				</>
			)}
		</>
	);
};

export default DriversTable;
