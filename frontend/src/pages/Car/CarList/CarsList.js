import {
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonLabel,
	IonList,
	IonLoading,
	IonMenuButton,
	IonModal,
	IonPopover,
	IonRow,
	IonSearchbar,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { addCircleSharp, alertCircle, eye } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { FaHistory, FaRegEdit, FaWindowClose } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCarList } from "../../../actions/carActions";
import { getDriversList } from "../../../actions/driverActions";
import WrapContent from "../../../components/WrapContent";
import "./CarList.css";

const DriversList = () => {
	const dispatch = useDispatch();

	const [modalCar, setModalCar] = useState("");
	const [keyword, setKeyword] = useState("");

	const [showModal, setShowModal] = useState(false);
	const [showPopover, setShowPopover] = useState(false);
	const [carPopover, setCarPopover] = useState();
	const driversList = useSelector((state) => state.driversList);
	const { loading } = driversList;

	const carList = useSelector((state) => state.carList);
	const { cars } = carList;

	useEffect(() => {
		dispatch(getDriversList(keyword));
		if (window.location.search.includes("carInfo")) {
			window.location.replace("/admin/CarsList");
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
		dispatch(getCarList());
		sortArray();
	}, [dispatch, keyword]);

	const sortArray = () => {
		cars.sort((a, b) => {
			return a?.carStatus?.toString()?.localeCompare(b.carStatus?.toString());
		});
	};

	return (
		<>
			{loading ? (
				<IonLoading isOpen={true} message={"Cars List Loading..."}></IonLoading>
			) : (
				<>
					<IonHeader id='header'>
						<IonToolbar>
							<IonButtons slot='start'>
								<IonMenuButton />
							</IonButtons>
							<IonTitle class='spx-font-color-black spx-bold'>
								Cars & Documents
							</IonTitle>
						</IonToolbar>
					</IonHeader>

					<IonContent class='grey'>
						<IonCard class='blue-border'>
							{cars.length !== 0 ? (
								<IonGrid className='ion-margin-top'>
									<IonRow>
										<IonCol
											size='4'
											className='ion-align-self-center ion-no-padding'>
											<IonSearchbar
												value={keyword}
												class='ion-no-padding ml-20'
												debounce={1000}
												placeholder='Search Car'
												onIonChange={(e) => {
													setKeyword(e.target.value);
													dispatch(getCarList(e.target.value));
												}}></IonSearchbar>
										</IonCol>
										<IonCol size='8' className='ion-align-self-center'>
											<Link to='/admin/add/Car'>
												<IonButton class='mr-20 ion-float-right'>
													Add Car{" "}
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
										<IonRow className='ion-align-self-center spx-color-white'>
											<IonCol className='spx-bold'>Car</IonCol>

											<IonCol className='spx-bold'>Insurance No.</IonCol>

											<IonCol className='spx-bold'>RC-TC No.</IonCol>

											<IonCol className='spx-bold'>PUC Number</IonCol>

											<IonCol className='spx-bold '>Remark</IonCol>

											<IonCol className='spx-bold'>Status</IonCol>

											<IonCol className='spx-bold '>Action</IonCol>
										</IonRow>
										<div className='hr'></div>
									</div>

									<IonList class='dairy-card ion-no-padding'>
										<IonGrid class='ion-no-padding'>
											{cars
												.sort((a, b) => {
													console.log(a, a.carStatus, b, b.carStatus);
													return a?.carStatus
														?.toString()
														?.localeCompare(b.carStatus?.toString());
												})
												?.map((car, i) => (
													<div className='ml-20 mr-20'>
														<IonRow
															className='ion-align-self-center ion-no-margin table  spx-font-color-black'
															key={car._id}>
															<IonCol class='pb-14 pt-14'>
																<IonLabel>{car.carNumber}</IonLabel>
															</IonCol>
															<IonCol>
																<WrapContent>
																	<IonLabel>{car?.insuranceNumber}</IonLabel>
																</WrapContent>
															</IonCol>
															<IonCol>
																<WrapContent>
																	<IonLabel>{car?.carRCTCNo}</IonLabel>
																</WrapContent>
															</IonCol>
															<IonCol>
																<WrapContent>
																	<IonLabel>{car?.PUCNumber}</IonLabel>
																</WrapContent>
															</IonCol>
															<IonCol>
																{(moment(car?.PUCEndDate).diff(
																	Date.now(),
																	"days",
																) < 5 &&
																	moment(car?.PUCEndDate).diff(
																		Date.now(),
																		"days",
																	) > 0) ||
																(moment(car?.insuranceEndDate).diff(
																	Date.now(),
																	"days",
																) < 5 &&
																	moment(car?.insuranceEndDate).diff(
																		Date.now(),
																		"days",
																	) > 0) ||
																(moment(car?.carFitnessEndDate).diff(
																	Date.now(),
																	"days",
																) < 5 &&
																	moment(car?.carFitnessEndDate).diff(
																		Date.now(),
																		"days",
																	) > 0) ? (
																	<IonIcon
																		icon={alertCircle}
																		class='danger remark-icon'
																		onClick={() => {
																			setShowPopover(true);
																			setCarPopover(car);
																		}}></IonIcon>
																) : moment(car?.PUCEndDate).diff(
																		Date.now(),
																		"days",
																  ) < 0 ||
																  moment(car?.insuranceEndDate).diff(
																		Date.now(),
																		"days",
																  ) < 0 ||
																  moment(carPopover?.carFitnessEndDate).diff(
																		Date.now(),
																		"days",
																  ) < 0 ? (
																	<IonIcon
																		class='danger remark-icon'
																		icon={alertCircle}
																		onClick={() => {
																			setShowPopover(true);
																			setCarPopover(car);
																		}}></IonIcon>
																) : (
																	<></>
																)}

																<IonPopover
																	isOpen={showPopover}
																	backdropDismiss={false}>
																	<IonRow>
																		<IonCol className='ion-text-right'>
																			<FaWindowClose
																				size={25}
																				id='close'
																				onClick={() => setShowPopover(false)}
																			/>
																		</IonCol>
																	</IonRow>
																	<IonCard>
																		<IonRow>
																			<IonCol>
																				{" "}
																				{moment(carPopover?.PUCEndDate).diff(
																					Date.now(),
																					"days",
																				) < 5 &&
																				moment(carPopover?.PUCEndDate).diff(
																					Date.now(),
																					"days",
																				) > 0 ? (
																					<>
																						<IonLabel>
																							PUC is Expiring in{" "}
																							<span className='danger'>
																								{moment(
																									carPopover?.PUCEndDate,
																								).diff(Date.now(), "days")}{" "}
																								Days...!
																							</span>
																						</IonLabel>
																					</>
																				) : moment(carPopover?.PUCEndDate).diff(
																						Date.now(),
																						"days",
																				  ) < 0 ? (
																					<>
																						<IonLabel class='danger'>
																							PUC has Expired..!
																						</IonLabel>
																					</>
																				) : (
																					<> </>
																				)}
																			</IonCol>
																		</IonRow>
																		<IonRow>
																			<IonCol>
																				{" "}
																				{moment(
																					carPopover?.insuranceEndDate,
																				).diff(Date.now(), "days") < 5 &&
																				moment(
																					carPopover?.insuranceEndDate,
																				).diff(Date.now(), "days") > 0 ? (
																					<>
																						<IonLabel>
																							Insurance is Expiring in{" "}
																							<span className='danger'>
																								{moment(
																									carPopover?.insuranceEndDate,
																								).diff(Date.now(), "days")}{" "}
																								Days...!
																							</span>
																						</IonLabel>
																					</>
																				) : moment(
																						carPopover?.insuranceEndDate,
																				  ).diff(Date.now(), "days") < 0 ? (
																					<>
																						<IonLabel class='danger'>
																							Insurance has Expired..!
																						</IonLabel>
																					</>
																				) : (
																					<></>
																				)}
																			</IonCol>
																		</IonRow>
																		<IonRow>
																			<IonCol>
																				{moment(
																					carPopover?.carFitnessEndDate,
																				).diff(Date.now(), "days") < 5 &&
																				moment(
																					carPopover?.carFitnessEndDate,
																				).diff(Date.now(), "days") > 0 ? (
																					<>
																						<IonLabel>
																							Fitness Crt. is Expiring in{" "}
																							<span className='danger'>
																								{moment(
																									carPopover?.carFitnessEndDate,
																								).diff(Date.now(), "days")}{" "}
																								Days...!
																							</span>
																						</IonLabel>
																					</>
																				) : moment(
																						carPopover?.carFitnessEndDate,
																				  ).diff(Date.now(), "days") < 0 ? (
																					<>
																						<IonLabel class='danger'>
																							Fitness Crt. has Expired..!
																						</IonLabel>
																						<br />
																					</>
																				) : (
																					<></>
																				)}
																			</IonCol>
																		</IonRow>
																	</IonCard>
																</IonPopover>
															</IonCol>

															{car.carStatus === true ? (
																<IonCol style={{ color: "green" }}>
																	{" "}
																	Assigned{" "}
																</IonCol>
															) : (
																<IonCol style={{ color: "red" }}>
																	Not Assigned
																</IonCol>
															)}

															<IonCol>
																<IonRow>
																	<IonCol>
																		{" "}
																		<Link to={`/admin/Car/${car._id}/edit`}>
																			<FaRegEdit size={20} alt='Edit User' />
																		</Link>
																	</IonCol>
																	<IonCol>
																		<IonIcon
																			id='close'
																			onClick={() => {
																				setShowModal(true);

																				setModalCar(car);
																			}}
																			icon={eye}
																		/>
																	</IonCol>
																	<IonCol>
																		<Link to={`/admin/car/history/${car._id}`}>
																			<FaHistory
																				style={{
																					cursor: "pointer",
																					fontSize: "1.5em",
																				}}
																			/>
																		</Link>
																	</IonCol>
																	<IonCol size='4'></IonCol>
																</IonRow>

																<IonModal
																	isOpen={showModal}
																	backdropDismiss={false}>
																	<IonContent fullscreen>
																		<IonToolbar class='closeIcon'>
																			<IonRow class='ion-margin-bottom'>
																				<IonCol class='ion-margin-end'>
																					<FaWindowClose
																						class='ion-float-right'
																						size={25}
																						id='close'
																						onClick={() => {
																							setShowModal(false);
																						}}
																					/>
																				</IonCol>
																			</IonRow>
																		</IonToolbar>
																		<IonRow>
																			<IonCol>
																				<IonLabel>Car Image</IonLabel>

																				<img src={modalCar.carImage} alt='' />
																			</IonCol>
																			<IonCol>
																				<IonLabel>Car RC-TC</IonLabel>
																				{console.log(modalCar.carRCTCImage)}
																				<img
																					src={modalCar.carRCTCImage}
																					alt=''
																				/>
																			</IonCol>
																		</IonRow>
																		<div className='hr'></div>
																		<IonRow>
																			<IonCol>
																				<IonLabel>Car RC Book</IonLabel>

																				<img
																					src={modalCar.RCBookImage}
																					alt=''
																				/>
																			</IonCol>
																			<IonCol>
																				<IonLabel>Car PUC</IonLabel>

																				<img src={modalCar.PUCImage} alt='' />
																			</IonCol>
																		</IonRow>
																		<div className='hr'></div>
																		<IonRow>
																			<IonCol>
																				<IonLabel>Car Insurance</IonLabel>

																				<img
																					src={modalCar.insuranceImage}
																					alt=''
																				/>
																			</IonCol>
																			<IonCol>
																				<IonLabel>Car Fitness Crt.</IonLabel>

																				<img
																					src={modalCar.carFitnessImage}
																					alt=''
																				/>
																			</IonCol>
																			<IonCol></IonCol>
																		</IonRow>
																	</IonContent>
																</IonModal>
															</IonCol>
														</IonRow>
														<IonRow>
															<IonCol>
																<div className='hr'></div>
															</IonCol>
														</IonRow>
													</div>
												))}
										</IonGrid>
									</IonList>
								</IonGrid>
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
												No Cars! Please add some cars{" "}
												<Link to='/admin/add/Car'>
													<>
														<IonLabel>Add Car</IonLabel>
													</>
												</Link>{" "}
											</IonLabel>
										</IonCol>
									</IonRow>
								</>
							)}
						</IonCard>
						<IonCard class='ion-margin'></IonCard>
						<IonCard class='ion-margin'></IonCard>
						<IonCard class='ion-margin'></IonCard>
						<IonCard class='ion-margin'></IonCard>
					</IonContent>
				</>
			)}
		</>
	);
};

export default DriversList;
