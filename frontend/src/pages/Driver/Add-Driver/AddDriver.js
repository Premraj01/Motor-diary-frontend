import {
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonContent,
	IonDatetime,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonLabel,
	IonList,
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
import { useHistory } from "react-router";
import { calendar, checkmarkCircle, closeCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import "./AddDriver.css";
import { add, format, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { registerDriver } from "../../../actions/driverActions";
import { getCarList } from "../../../actions/carActions";
import axios from "axios";
import { displayDateFormate } from "../../../components/Services/DateFormat";

const AddDriver = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [message, setMessage] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [licence, setLicence] = useState("");
	const [image, setImage] = useState("");
	const [licenceImage, setLicenceImage] = useState("");
	const [uploading, setUploading] = useState(false);
	const [carId, setCarId] = useState("");
	const [carAssignedDate, setCarAssignedDate] = useState("");

	const [designation, setDesignation] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [showToast, setShowToast] = useState(false);
	const [success, setSuccess] = useState(false);

	const driverRegister = useSelector((state) => state.driverRegister);
	const { error, driverInfo } = driverRegister;

	const carList = useSelector((state) => state.carList);
	const { cars } = carList;

	useEffect(() => {
		dispatch(getCarList());
		if (driverInfo) {
			if (Object.keys(driverInfo).length !== 0) {
				setShowToast(true);
				setSuccess(true);
				setTimeout(() => {
					history.push(`/admin/DriversList?driverInfo`);
				}, 1000);
			}
		} else if (error) {
			setShowToast(true);
			setSuccess(false);
			setMessage(error);
		}
	}, [driverInfo, birthDate, error, history, dispatch]);

	const submitHandler = (e) => {
		if (password !== confirmPassword) {
			setShowToast(true);
			setSuccess(false);
			setMessage("Password does not match..!");
		} else {
			dispatch(
				registerDriver(
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
				),
			);
		}

		e.preventDefault();
	};

	const validateNumber = (e) => {
		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(e.charCode);
		if (e.keyCode !== 8 && !pattern.test(inputChar)) {
			e.preventDefault();
		}
	};

	return (
		<IonContent class='grey'>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle class='spx-font-color-black'> Add Driver </IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonToast
				isOpen={showToast}
				onDidDismiss={() => setShowToast(false)}
				message={success ? "Car Added Successfully..!!" : message}
				icon={success ? checkmarkCircle : closeCircle}
				position='left'
				color={success ? "success" : "danger"}
				buttons={[
					{
						text: "Close",
						role: "cancel",
					},
				]}
			/>

			<IonCard className='blue-border'>
				<>
					<form onSubmit={submitHandler} className='ion-padding'>
						<IonRow class='ion'>
							{/* <IonCol>
								<IonLabel class='spx-font-color-black'>Driver</IonLabel>
							</IonCol> */}
						</IonRow>
						<IonRow>
							<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
								<IonInput
									onIonChange={(e) => setFirstName(e.target.value)}
									placeholder='Enter First Name'
									class='input-field'
									required
								/>
							</IonCol>

							<IonCol className='ion-align-self-center ion-margin-start ion-text-center'>
								<IonInput
									onIonChange={(e) => setLastName(e.target.value)}
									placeholder='Enter Last Name'
									class='input-field'
									required
								/>
							</IonCol>
						</IonRow>
						<div className='hr'></div>

						<IonRow>
							<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
								<IonInput
									type='text'
									onIonChange={(e) => setMobileNumber(e.target.value)}
									placeholder='Enter Mobile Number'
									minlength={10}
									maxlength={10}
									onKeyPress={validateNumber}
									class='input-field'
									required
								/>
							</IonCol>

							<IonCol className='ion-align-self-center ion-margin-start ion-text-center'>
								<IonInput className='input-field' disabled>
									<input
										accept='image/*'
										id='input-field'
										name='uploadfile'
										onChange={async (e) => {
											const file = e.target.files[0];

											var blob = file.slice(0, file.size, file.type);
											var newFile = new File(
												[blob],
												`${firstName}_${mobileNumber}_Profile`,
												{
													type: file.type,
												},
											);
											const formData = new FormData();
											formData.append("image", newFile);

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

							<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
						</IonRow>

						<div className='hr'></div>

						<IonRow>
							<IonCol className='ion-align-self-center ion-text-center '>
								<IonInput
									id='purchase-invoice-date'
									class='input-field '
									value={displayDateFormate(birthDate)}
									placeholder='Birth Date...'>
									{" "}
									<IonButtons>
										<IonButton
											slot='start'
											fill='clear'
											size='small'
											id='open-purchase-invoice-date'>
											<IonIcon icon={calendar} size='small' />
										</IonButton>
									</IonButtons>
								</IonInput>
								<IonPopover
									trigger='open-purchase-invoice-date'
									class='m-20'
									showBackdrop={true}
									dismissOnSelect={false}>
									<IonDatetime
										presentation='date'
										mode='md'
										slot='top'
										onIonChange={(ev) => {
											setBirthDate(ev.target.value);
										}}
									/>
								</IonPopover>
							</IonCol>

							<IonCol class='ion-text-center'>
								<IonSelect
									value={designation}
									onIonChange={(e) => setDesignation(e.target.value)}
									class='input-field spx-font-color-black'
									placeholder='Choose Designation'>
									<IonSelectOption value='male'>Driver</IonSelectOption>
								</IonSelect>
							</IonCol>

							<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
						</IonRow>

						<div className='hr'></div>

						<IonRow>
							<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
								<IonInput
									onIonChange={(e) => setPassword(e.target.value)}
									placeholder='Enter Password'
									class='input-field'
									required
								/>
							</IonCol>

							<IonCol className='ion-align-self-center ion-margin-start ion-text-center'>
								<IonInput
									onIonChange={(e) => setConfirmPassword(e.target.value)}
									placeholder='Confirm Password'
									class='input-field'
									required
								/>
							</IonCol>
						</IonRow>

						<div className='hr'></div>

						<IonRow>
							<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
								<IonInput
									onIonChange={(e) => setLicence(e.target.value)}
									placeholder='Enter Licence Number'
									class='input-field'
								/>
							</IonCol>

							<IonCol className='ion-align-self-center ion-margin-start ion-text-center'>
								<IonInput className='input-field' disabled>
									<input
										accept='image/*'
										id='input-field'
										name='uploadfile'
										onChange={async (e) => {
											const file = e.target.files[0];

											var blob = file.slice(0, file.size, file.type);
											var newFile = new File(
												[blob],
												`${firstName}_${mobileNumber}_Licence`,
												{
													type: file.type,
												},
											);
											const formData = new FormData();
											formData.append("image", newFile);

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
									<label for='input-field'>Choose Driver's Licence Image</label>
								</IonInput>
							</IonCol>
						</IonRow>

						<div className='hr'></div>
						<IonRow>
							<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
								<IonInput
									id='car-assign-date'
									class='input-field '
									value={displayDateFormate(carAssignedDate)}
									placeholder='Joining Date'>
									{" "}
									<IonButtons>
										<IonButton
											slot='start'
											fill='clear'
											size='small'
											id='open-car-assign-date'>
											<IonIcon icon={calendar} size='small' />
										</IonButton>
									</IonButtons>
								</IonInput>
								<IonModal
									trigger='open-car-assign-date'
									class='m-20'
									initialBreakpoint={0.6}
									showBackdrop={true}
									dismissOnSelect={false}>
									<>
										<IonDatetime
											presentation='date'
											className='ml-4'
											mode='ios'
											slot='top'
											onIonChange={(ev) => {
												setCarAssignedDate(ev.target.value);
											}}
										/>
									</>
								</IonModal>
							</IonCol>
							<IonCol class='ion-text-center'>
								<IonSelect
									value={carId}
									class='input-field spx-font-color-black ion-margin-start'
									placeholder='Choose Car'
									onIonChange={(ev) => setCarId(ev.target.value)}>
									{cars.map((c) => {
										if (c.carStatus === false) {
											return (
												<IonSelectOption value={c} key={c._id}>
													{c.carName + "-" + c.carNumber}
												</IonSelectOption>
											);
										} else {
											return (
												<IonLabel>All Cars are Already Assigned...!</IonLabel>
											);
										}
									})}
								</IonSelect>
							</IonCol>
						</IonRow>

						<div className='hr'></div>

						<IonRow>
							<IonCol class='ion-text-center'>
								<IonButton className='ion-margin-top' type='submit'>
									Save
								</IonButton>
							</IonCol>
						</IonRow>
					</form>
				</>
			</IonCard>
		</IonContent>
	);
};

export default AddDriver;
