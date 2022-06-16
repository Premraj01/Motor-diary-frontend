import {
	IonAlert,
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonLoading,
	IonMenuButton,
	IonPopover,
	IonRow,
	IonSearchbar,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { addCircleSharp } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaHistory, FaRegEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCarList, updateCar } from "../../../actions/carActions";
import { getDriversList, updateDriver } from "../../../actions/driverActions";
import { displayDateFormate } from "../../../components/Services/DateFormat";

const DriversList = () => {
	const dispatch = useDispatch();

	const driversList = useSelector((state) => state.driversList);
	const { drivers } = driversList;

	const [showAlert, setShowAlert] = useState(false);
	const [status, setStatus] = useState("active");
	const [driver, setDriver] = useState(false);
	const [car, setCar] = useState(false);
	const [popover, setPopover] = useState(false);
	const [popoverData, setPopoverData] = useState("");

	const [keyword, setKeyword] = useState("");

	const carList = useSelector((state) => state.carList);
	const { loading: carListLoading, cars } = carList;

	useEffect(() => {
		dispatch(getDriversList(keyword));
		dispatch(getCarList());
		if (window.location.search.includes("driverInfo")) {
			window.location.replace("/admin/DriversList");
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
	}, [dispatch, keyword]);

	const dischargeDriver = (driver, car) => {
		dispatch(
			updateDriver({
				_id: driver._id,
				firstName: driver.firstName,
				lastName: driver.lastName,
				mobileNumber: driver.mobileNumber,
				gender: driver.gender,
				password: " ",
				licence: driver.licence,
				carId: null,
				birthDate: driver.birthDate,
				designation: driver.designation,
				status: "inactive",
			}),
			dispatch(
				updateCar({
					_id: car._id,
					carName: car.carName,
					RCNumber: car.RCNumber,
					PUCNumber: car.PUCNumber,
					carNumber: car.carNumber,
					insuranceNumber: car.insuranceNumber,
					carStatus: false,
				}),
			),
		);
		window.location.reload();
	};

	const onHover = (data) => {
		// return (
		// 	<IonPopover>
		// 		<IonLabel>{data}</IonLabel>
		// 	</IonPopover>
		// );
		setPopover(true);
		setPopoverData(data);
		console.log("first");
	};
	const onHoverLeave = () => {
		setPopover(false);
	};

	return (
		<>
			{carListLoading ? (
				<IonLoading
					isOpen={true}
					message="Loading Driver's List..."></IonLoading>
			) : (
				<>
					<IonHeader>
						<IonToolbar>
							<IonButtons slot='start'>
								<IonMenuButton />
							</IonButtons>
							<IonTitle class='spx-bold spx-font-color-black'>Drivers</IonTitle>
						</IonToolbar>
					</IonHeader>
					<IonContent class='grey'>
						<IonCard class='blue-border '>
							{drivers.length !== 0 ? (
								<>
									<IonGrid className='ion-margin-top header-value'>
										<IonRow>
											<IonCol size='3' class='ml-20'>
												<IonSearchbar
													class='ion-float-left ion-no-padding '
													placeholder='Search Driver'
													value={keyword}
													debounce={1000}
													onIonChange={(e) => {
														setKeyword(e.target.value);
														// dispatch(getDriversList(e.target.value));
													}}></IonSearchbar>
											</IonCol>
											<IonCol></IonCol>
											<IonCol
												size='2'
												className='ion-align-self-center ion-text-center '>
												<IonItem lines='none'>
													<IonSelect
														value={status}
														onIonChange={(ev) => setStatus(ev.target.value)}
														className='ion-padding'
														style={{
															height: "36px",
															width: "100%",
															background: "rgb(208, 225, 241)",
															borderRadius: "5px",
														}}
														class='spx-font-color-black ml-20 '
														placeholder='Choose'>
														<IonSelectOption
															value='active'
															class='ion-padding-start'>
															Active
														</IonSelectOption>
														<IonSelectOption
															value='inactive'
															class='ion-padding-start'>
															Inactive
														</IonSelectOption>
													</IonSelect>
												</IonItem>
											</IonCol>

											<IonCol
												size='2'
												className='ion-align-self-center mr-20 ion-text-center'>
												<Link to='/admin/add/Driver'>
													<IonButton class='ion-no-margin'>
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
											<IonRow className=' ion-align-self-center '>
												<IonCol className='spx-bold  spx-color-white'>
													Name
												</IonCol>

												<IonCol className='spx-bold  spx-color-white'>
													Contact{" "}
												</IonCol>

												<IonCol className='spx-bold  spx-color-white'>
													Car
												</IonCol>

												<IonCol className='spx-bold  spx-color-white'>
													Joining Date
												</IonCol>

												<IonCol className='spx-bold  spx-color-white'>
													<IonLabel>Monthly Reading</IonLabel>
												</IonCol>

												<IonCol className='spx-bold  spx-color-white'>
													Status
												</IonCol>

												<IonCol className='spx-bold  spx-color-white'>
													Action
												</IonCol>
											</IonRow>

											<div className='hr'></div>
										</div>

										{status === "active" ? (
											<div className='ml-20 mr-20'>
												<IonList class='dairy-card ion-no-padding'>
													<IonGrid class='ion-no-padding'>
														{drivers
															.slice(0)
															.reverse()
															.map((d, i) => {
																if (d.status === "active") {
																	return (
																		<>
																			<IonRow
																				className='ion-no-margin ion-align-self-center  table  spx-font-color-black'
																				key={d._id}>
																				<IonCol class='pt-14 pb-14'>
																					<IonLabel
																						class='content-restrict ion-padding-top ion-padding-bottom'
																						id='open-popover'>
																						{d.firstName} {d.lastName}
																					</IonLabel>
																				</IonCol>

																				<IonCol>
																					<IonLabel>{d.mobileNumber}</IonLabel>
																				</IonCol>

																				{d.carId ? (
																					cars.map(
																						(car) =>
																							d.carId === car._id && (
																								<IonCol key={car._id}>
																									<IonLabel>
																										{" "}
																										{car.carName}
																									</IonLabel>
																								</IonCol>
																							),
																					)
																				) : (
																					<IonCol>-</IonCol>
																				)}

																				<IonCol>
																					<IonLabel>
																						{displayDateFormate(
																							d.carAssignedDate,
																						)}
																					</IonLabel>
																				</IonCol>

																				<IonCol class='ion-text-center'>
																					<IonLabel>
																						{d.monthlyTripReading}
																					</IonLabel>
																				</IonCol>

																				{d.status === "active" ? (
																					<IonCol style={{ color: "green" }}>
																						<IonLabel>
																							{d.status.toUpperCase()}
																						</IonLabel>
																					</IonCol>
																				) : (
																					<IonCol>
																						<IonLabel>
																							{d.status.toUpperCase()}
																						</IonLabel>
																					</IonCol>
																				)}

																				<IonCol>
																					<IonRow>
																						<IonCol>
																							<Link
																								to={`/admin/driver/${d._id}/edit`}>
																								<FaRegEdit
																									style={{
																										cursor: "pointer",
																										fontSize: "1.5em",
																									}}
																									alt='Edit User'
																								/>
																							</Link>
																						</IonCol>
																						<IonCol>
																							{d.status === "active" && (
																								<div>
																									<FaTrash
																										onClick={() => {
																											setShowAlert(true);
																											setDriver(d);
																											d.carId &&
																												cars.map(
																													(car) =>
																														d.carId ===
																															car._id &&
																														setCar(car),
																												);
																										}}
																										style={{
																											cursor: "pointer",
																											color: "red",
																											fontSize: "1.5em",
																										}}
																										alt='action'
																									/>
																								</div>
																							)}
																						</IonCol>
																						<IonCol>
																							<Link
																								to={`/admin/driver/history/${d._id}`}>
																								<FaHistory
																									style={{
																										cursor: "pointer",
																										fontSize: "1.2em",
																									}}
																								/>
																							</Link>
																						</IonCol>
																						<IonCol size='4'></IonCol>
																					</IonRow>
																				</IonCol>

																				<IonAlert
																					isOpen={showAlert}
																					onDidDismiss={() =>
																						setShowAlert(false)
																					}
																					cssClass='my-custom-class'
																					message={`Status will be changed to <strong>INACTIVE..!!</strong>`}
																					buttons={[
																						{
																							text: "Cancel",
																							role: "cancel",
																							cssClass: "secondary",
																							id: "cancel-button",
																						},
																						{
																							text: "Okay",
																							id: "confirm-button",
																							handler: () => {
																								dischargeDriver(driver, car);
																							},
																						},
																					]}
																				/>
																			</IonRow>

																			<div className='hr'></div>
																		</>
																	);
																}
															})}
													</IonGrid>
												</IonList>
											</div>
										) : (
											<div className='ml-20 mr-20'>
												{drivers
													.slice(0)
													.reverse()
													.map((d, i) => {
														if (d.status === "inactive") {
															return (
																<>
																	<IonRow
																		className='ion-align-self-center table  spx-font-color-black'
																		key={d._id}>
																		<IonCol class='pt-14 pb-14'>
																			{d.firstName}&nbsp;
																			{d.lastName}
																		</IonCol>
																		<IonCol>{d.mobileNumber}</IonCol>
																		<IonCol>
																			{" "}
																			{displayDateFormate(d.birthDate)}
																		</IonCol>
																		{d.carId ? (
																			cars.map(
																				(car) =>
																					d.carId === car._id && (
																						<IonCol key={car._id}>
																							{car.carName}
																						</IonCol>
																					),
																			)
																		) : (
																			<IonCol>-</IonCol>
																		)}
																		<IonCol>{d.monthlyTripReading}</IonCol>
																		{d.status === "active" ? (
																			<IonCol style={{ color: "green" }}>
																				{d.status.toUpperCase()}
																			</IonCol>
																		) : (
																			<IonCol>{d.status.toUpperCase()}</IonCol>
																		)}

																		<IonCol>
																			<IonRow>
																				<IonCol>
																					<Link
																						to={`/admin/driver/${d._id}/edit`}>
																						<FaRegEdit
																							style={{
																								cursor: "pointer",
																								fontSize: "1.5em",
																							}}
																							alt='Edit User'
																						/>
																					</Link>
																				</IonCol>

																				<IonCol>
																					<Link
																						to={`/admin/driver/history/${d._id}`}>
																						<FaHistory
																							style={{
																								cursor: "pointer",
																								fontSize: "1.2em",
																							}}
																						/>
																					</Link>
																				</IonCol>
																				<IonCol size='6'></IonCol>
																			</IonRow>
																		</IonCol>
																		<IonAlert
																			isOpen={showAlert}
																			onDidDismiss={() => setShowAlert(false)}
																			cssClass='my-custom-class'
																			message={`Status will be changed to <strong>INACTIVE..!!</strong>`}
																			buttons={[
																				{
																					text: "Cancel",
																					role: "cancel",
																					cssClass: "secondary",
																					id: "cancel-button",
																				},
																				{
																					text: "Okay",
																					id: "confirm-button",
																					handler: () => {
																						dischargeDriver(driver, car);
																					},
																				},
																			]}
																		/>
																	</IonRow>
																	<div className='hr'></div>
																</>
															);
														}
													})}
											</div>
										)}
									</IonGrid>
								</>
							) : (
								<>
									<IonRow>
										<IonCol class='ion-text-center'>
											<IonRow>
												<IonCol class='ion-text-center'>
													<AiOutlineFileAdd size={100} />
												</IonCol>
											</IonRow>
											<IonLabel class='spx-bold'>
												No Drivers! Please add some drivers{" "}
												<Link to='/admin/add/Driver'>
													<>
														<IonLabel>Add Driver</IonLabel>
													</>
												</Link>{" "}
											</IonLabel>
										</IonCol>
									</IonRow>
								</>
							)}
						</IonCard>
					</IonContent>
				</>
			)}
		</>
	);
};

export default DriversList;
