import {
	IonAlert,
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonContent,
	IonDatetime,
	IonHeader,
	IonIcon,
	IonInput,
	IonLabel,
	IonLoading,
	IonMenuButton,
	IonModal,
	IonPopover,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToast,
	IonToolbar,
} from "@ionic/react";
import axios from "axios";
import { add, format, parseISO } from "date-fns";
import {
	arrowBackCircleOutline,
	calendar,
	checkmarkCircle,
	close,
	closeCircle,
	eye,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams } from "react-router";
import {
	getCarDetails,
	getCarList,
	updateCar,
} from "../../../actions/carActions";
import { getDriverDetails, updateDriver } from "../../../actions/driverActions";
import { displayDateFormate } from "../../../components/Services/DateFormat";
import { CAR_UPDATE_RESET } from "../../../constants/carConstants";
import { DRIVER_UPDATE_RESET } from "../../../constants/driversConstants";
import AssignCar from "../../Car/carOperations/AssignCar";

const EditDriver = () => {
	const dispatch = useDispatch();
	const { id } = useParams();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [licence, setLicence] = useState("");
	const [image, setImage] = useState("");
	const [carId, setCarId] = useState(null);
	const [previousCarId, setPreviousCarId] = useState("");
	const [licenceImage, setLicenceImage] = useState("");
	const [designation, setDesignation] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [uploading, setUploading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [showImageModal, setShowImageModal] = useState(false);
	const [showLicenceModal, setShowLicenceModal] = useState(false);
	const [carAssignedDate, setCarAssignedDate] = useState("");
	const [showCalenderModal, setShowAssignDateModal] = useState(false);
	const [showBirthModal, setShowBirthModal] = useState(false);

	const [showToast, setShowToast] = useState(false);
	const [success, setSuccess] = useState(false);

	const driverDetails = useSelector((state) => state.driverDetails);
	const { loading, error, driver } = driverDetails;

	const carDetails = useSelector((state) => state.carDetails);
	const {
		loading: carDetailsLoading,
		error: carDetailsError,
		car,
	} = carDetails;

	const carList = useSelector((state) => state.carList);
	const { loading: carListLoading, error: carListError, cars } = carList;

	const driverUpdate = useSelector((state) => state.driverUpdate);
	const {
		loading: driverUpdateLoading,
		error: driverUpdateError,
		success: driverUpdateSuccess,
	} = driverUpdate;

	const carUpdate = useSelector((state) => state.carUpdate);
	const {
		loading: carUpdateLoading,
		error: carUpdateError,
		success: carUpdateSuccess,
	} = carUpdate;

	useEffect(() => {
		dispatch(getCarList());

		if (driverUpdateSuccess) {
			setShowToast(true);
			setSuccess(true);
			setMessage("Driver Updated Successfully..!!");
			dispatch({ type: DRIVER_UPDATE_RESET });
		} else if (carUpdateSuccess) {
			setShowToast(true);
			setSuccess(true);
			setMessage("Car Assigned Successfully..!!");
			dispatch({ type: CAR_UPDATE_RESET });
		} else {
			if (!driver.firstName || driver._id !== id) {
				dispatch(getDriverDetails(id));
			} else {
				if (driver.carId) {
					dispatch(getCarDetails(driver.carId));
				}
				setFirstName(driver.firstName);
				setLastName(driver.lastName);
				setMobileNumber(driver.mobileNumber);
				setCarAssignedDate(driver.carAssignedDate);
				setPassword(driver.password);
				setLicence(driver.licence);
				setCarId(driver.carId);
				setImage(driver.photo);
				setLicenceImage(driver.licenceImage);
				setBirthDate(driver.birthDate);
				setDesignation(driver.designation);
			}
		}
	}, [dispatch, driver, driverUpdateSuccess, carUpdateSuccess]);

	const submitHandler = (e) => {
		dispatch(
			updateDriver({
				_id: id,
				firstName,
				lastName,
				mobileNumber,
				carAssignedDate,
				licence,
				password,
				image,
				licenceImage,
				designation,
				birthDate,
				carId,
			}),
		);
	};

	const dischargeCar = (driver, car) => {
		dispatch(
			updateDriver({
				_id: driver._id,
				firstName: driver.firstName,
				lastName: driver.lastName,
				mobileNumber: driver.mobileNumber,
				password: driver.password,
				licence: driver.licence,
				image: driver.photo,
				licenceImage: driver.licenceImage,
				carId: null,
				birthDate: driver.birthDate,
				carAssignedDate: driver.carAssignedDate,
				designation: driver.designation,
				status: driver.status,
			}),
		);
		dispatch(
			updateCar({
				_id: car._id,
				carName: car.carName,
				carNumber: car.carNumber,
				carImage: car.carImage,
				RCNumber: car.RCNumber,
				RCBookImage: car.RCBookImage,
				PUCNumber: car.PUCNumber,
				PUCImage: car.PUCImage,
				PUCStartDate: car.PUCStartDate,
				PUCEndDate: car.PUCEndDate,
				insuranceNumber: car.insuranceNumber,
				insuranceImage: car.insuranceImage,
				insuranceStartDate: car.insuranceStartDate,
				insuranceEndDate: car.insuranceEndDate,
				carFitnessImage: car.carFitnessImage,
				carFitnessStartDate: car.carFitnessStartDate,
				carFitnessEndDate: car.carFitnessEndDate,
				carRCTCNo: car.carRCTCNo,
				carRCTCImage: car.carRCTCImage,
				carPurchaseInvoice: car.carPurchaseInvoice,
				carPurchaseInvoiceDate: car.carPurchaseInvoiceDate,
				carStatus: false,
			}),
		);
		window.location.reload();
	};

	const validateNumber = (e) => {
		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(e.charCode);
		if (e.keyCode !== 8 && !pattern.test(inputChar)) {
			e.preventDefault();
		}
	};

	return (
		<>
			<>
				<IonContent class='grey'>
					<IonHeader>
						<IonToolbar>
							<IonButtons slot='start'>
								<IonMenuButton />
							</IonButtons>
							<IonTitle> Edit Driver </IonTitle>
						</IonToolbar>
					</IonHeader>
					<IonToast
						isOpen={showToast}
						onDidDismiss={() => setShowToast(false)}
						message={success ? message : message}
						icon={success ? checkmarkCircle : closeCircle}
						position='left'
						color={success ? "success" : "danger"}
						buttons={[
							{
								text: "Close",
								role: "cancel",
								handler: () => {},
							},
						]}
					/>
					<IonCard class='blue-border'>
						<IonRow>
							<IonCol size='5'>
								<IonButton
									class='ion-no-margin'
									fill='clear'
									routerLink='/admin/DriversList'>
									<IonIcon icon={arrowBackCircleOutline} />
									Back
								</IonButton>
							</IonCol>
						</IonRow>
						<IonRow>
							<IonCol size='10'>
								<AssignCar driver={driver} id={id} car={{ ...car }} />
							</IonCol>
							<IonCol size='2' className='ion-align-self-center remove-car '>
								{" "}
								<IonButton
									onClick={() => setShowAlert(true)}
									disabled={!driver.carId}>
									Remove Car
								</IonButton>{" "}
							</IonCol>{" "}
							<IonAlert
								isOpen={showAlert}
								onDidDismiss={() => setShowAlert(false)}
								cssClass='my-custom-class'
								message={`Car will be removed for this driver..!!`}
								buttons={[
									{
										text: "Cancel",
										role: "cancel",
										cssClass: "secondary",
										id: "cancel-button",
										handler: (blah) => {},
									},
									{
										text: "Okay",
										id: "confirm-button",
										handler: () => {
											dischargeCar(driver, car);
										},
									},
								]}
							/>
						</IonRow>
						<div className='hr'></div>
						<form onSubmit={submitHandler} className='ion-padding-bottom'>
							<IonRow>
								<IonCol className='ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
									First Name
								</IonCol>
								<IonCol className='ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
									Last Name
								</IonCol>
							</IonRow>
							<IonRow>
								<IonCol class='ion-align-self-center'>
									<IonRow>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
											<IonInput
												onIonChange={(e) => setFirstName(e.target.value)}
												placeholder='Enter First Name'
												value={firstName}
												class='input-field'
												// required
											/>
										</IonCol>

										<IonCol className='ion-align-self-center ion-margin-start ion-text-center'>
											<IonInput
												onIonChange={(e) => setLastName(e.target.value)}
												placeholder='Enter Last Name'
												value={lastName}
												class='input-field'
												// required
											/>
										</IonCol>
									</IonRow>
									<div className='hr'></div>
									<IonRow>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
											Mobile Number
										</IonCol>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
											Profile Photo
										</IonCol>
									</IonRow>
									<IonRow>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
											<IonInput
												type='text'
												onIonChange={(e) => setMobileNumber(e.target.value)}
												placeholder='Enter Mobile Number'
												minlength={10}
												maxlength={10}
												value={mobileNumber}
												onKeyPress={validateNumber}
												class='input-field'
												required
											/>
										</IonCol>

										{!image ? (
											<IonCol className='ion-align-self-center ion-margin-start ion-text-center'>
												<IonInput className='input-field' disabled>
													<input
														accept='image/*'
														id='input-field'
														name='uploadfile'
														onChange={async (e) => {
															const file = e.target.files[0];

															const formData = new FormData();
															formData.append("image", file);
															setUploading(true);

															try {
																const config = {
																	headers: {
																		"Content-Type": "multipart/form-data",
																	},
																};
																const { data } = await axios.post(
																	`/api/upload/driver/${firstName}/${lastName}`,
																	formData,
																	config,
																);
																setImage(data);
																setUploading(false);
															} catch (error) {
																console.error(error);
																setUploading(false);
															}
														}}
														disabled={uploading}
														placeholder='Enter Car Photo'
														type='file'
														style={{
															paddingTop: "7px",
															paddingBottom: "7px",
															paddingLeft: "7px",
														}}
														className='input-field'
													/>
													<label for='input-field'>Choose Driver's Photo</label>
												</IonInput>
											</IonCol>
										) : (
											<IonCol class='ion-align-self-center'>
												<IonIcon
													color='green'
													id='close'
													onClick={() => {
														setShowImageModal(true);
													}}
													icon={eye}
												/>

												<IonIcon
													color='red'
													id='close'
													onClick={() => {
														setImage();
													}}
													icon={close}
												/>
												<IonModal isOpen={showImageModal}>
													<>
														<IonToolbar class='closeIcon'>
															<IonRow class='ion-margin-bottom'>
																<IonCol class='ion-margin-end'>
																	<FaWindowClose
																		class='ion-float-right'
																		size={25}
																		id='close'
																		onClick={() => {
																			setShowImageModal(false);
																		}}
																	/>
																</IonCol>
															</IonRow>
														</IonToolbar>
													</>
													<IonLabel>Profile Image</IonLabel>

													<img src={image} alt='' />
												</IonModal>
											</IonCol>
										)}

										<IonLoading
											isOpen={uploading}
											spinner='bubbles'></IonLoading>
									</IonRow>
									<div className='hr'></div>
									<IonRow>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
											Birth Date
										</IonCol>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
											Joining Date
										</IonCol>
									</IonRow>
									<IonRow>
										<IonCol className='ion-align-self-center ion-text-center'>
											<IonInput
												id='birth-date'
												class='input-field '
												value={displayDateFormate(birthDate)}
												placeholder='Birth Date...'>
												{" "}
												<IonButtons>
													<IonButton
														slot='start'
														fill='clear'
														size='small'
														id='open-birth-date'
														onClick={() => {
															setShowBirthModal(true);
														}}>
														<IonIcon icon={calendar} size='small' />
													</IonButton>
												</IonButtons>
											</IonInput>
											<IonModal
												trigger='open-birth-date'
												class='m-20'
												showBackdrop={true}
												initialBreakpoint={0.6}
												isOpen={showBirthModal}>
												<IonDatetime
													presentation='date'
													mode='ios'
													class='mlt-205'
													slot='top'
													onIonChange={(ev) => {
														setBirthDate(ev.target.value);
														setShowBirthModal(false);
													}}
												/>
											</IonModal>
										</IonCol>
										<IonCol className='ion-align-self-center ion-text-center'>
											<IonInput
												id='assign-car-date'
												class='input-field '
												value={displayDateFormate(carAssignedDate)}
												placeholder='Birth Date...'>
												{" "}
												<IonButtons>
													<IonButton
														slot='start'
														fill='clear'
														size='small'
														id='open-assign-car-date'
														onClick={() => {
															setShowAssignDateModal(true);
														}}>
														<IonIcon icon={calendar} size='small' />
													</IonButton>
												</IonButtons>
											</IonInput>
											<IonModal
												trigger='open-assign-car-date'
												class='m-20'
												showBackdrop={true}
												initialBreakpoint={0.6}
												isOpen={showCalenderModal}>
												<IonDatetime
													presentation='date'
													mode='ios'
													class='mlt-205'
													slot='top'
													onIonChange={(ev) => {
														setCarAssignedDate(ev.target.value);
														setShowAssignDateModal(false);
													}}
												/>
											</IonModal>
										</IonCol>
									</IonRow>

									<div className='hr'></div>
									<IonRow>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
											Password
										</IonCol>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
											Designation
										</IonCol>
									</IonRow>

									<IonRow>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
											<IonInput
												onIonChange={(e) => setPassword(e.target.value)}
												placeholder='Enter Password'
												value={password}
												class='input-field'
												// required
											/>
										</IonCol>

										<IonCol className='ion-align-self-center ion-text-center ion-margin-start ion-no-padding '>
											<IonSelect
												value={designation}
												onIonChange={(e) => setDesignation(e.target.value)}
												class='input-field spx-font-color-black'
												placeholder='Choose Designation'>
												<IonSelectOption value='male'>Driver</IonSelectOption>
											</IonSelect>
										</IonCol>

										{/* <IonCol
											
											className='ion-align-self-center ion-margin-start ion-text-center'>
											<IonInput
												onIonChange={(e) => setConfirmPassword(e.target.value)}
												value={password}
												placeholder='Confirm Password'
												class='input-field'
												// required
											/>
										</IonCol> */}
									</IonRow>
									<div className='hr'></div>
									<IonRow>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
											Licence Number
										</IonCol>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
											Licence Image
										</IonCol>
									</IonRow>
									<IonRow>
										<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
											<IonInput
												onIonChange={(e) => setLicence(e.target.value)}
												placeholder='Enter Licence Number'
												value={licence}
												class='input-field'
												// required
											/>
										</IonCol>

										{!licenceImage ? (
											<IonCol className='ion-align-self-center ion-margin-start ion-text-center'>
												<IonInput className='input-field' disabled>
													<input
														accept='image/*'
														id='input-field'
														name='uploadfile'
														onChange={async (e) => {
															const file = e.target.files[0];

															const formData = new FormData();
															formData.append("image", file);

															setUploading(true);

															try {
																const config = {
																	headers: {
																		"Content-Type": "multipart/form-data",
																	},
																};

																const { data } = await axios.post(
																	`/api/upload/driver/${firstName}/${lastName}`,
																	formData,
																	config,
																);
																setLicenceImage(data);
																setUploading(false);
															} catch (error) {
																console.error(error);
																setUploading(false);
															}
														}}
														disabled={uploading}
														placeholder='Enter Car Photo'
														type='file'
														style={{
															paddingTop: "7px",
															paddingBottom: "7px",
															paddingLeft: "7px",
														}}
														className='input-field'
													/>
													<label for='input-field'>
														Choose Driver's Licence Image
													</label>
												</IonInput>
											</IonCol>
										) : (
											<IonCol class='ion-align-self-center'>
												<IonIcon
													color='green'
													id='close'
													onClick={() => {
														setShowLicenceModal(true);
													}}
													icon={eye}
												/>

												<IonIcon
													color='red'
													id='close'
													onClick={() => {
														setLicenceImage();
													}}
													icon={close}
												/>
												<IonModal isOpen={showLicenceModal}>
													<>
														<IonToolbar class='closeIcon'>
															<IonRow class='ion-margin-bottom'>
																<IonCol class='ion-margin-end'>
																	<FaWindowClose
																		class='ion-float-right'
																		size={25}
																		id='close'
																		onClick={() => {
																			setShowLicenceModal(false);
																		}}
																	/>
																</IonCol>
															</IonRow>
														</IonToolbar>
													</>
													<IonLabel>Licence Image</IonLabel>

													<img src={licenceImage} alt='' />
												</IonModal>
											</IonCol>
										)}
									</IonRow>

									<div className='hr'></div>
								</IonCol>
							</IonRow>

							<IonRow>
								<IonCol class='ion-text-center'>
									<IonButton routerLink='/admin/DriversList' type='submit'>
										Update
									</IonButton>
								</IonCol>
							</IonRow>
						</form>
					</IonCard>
				</IonContent>
			</>
		</>
	);
};

export default EditDriver;
