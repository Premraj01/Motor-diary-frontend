import {
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
	IonTitle,
	IonToast,
	IonToolbar,
} from "@ionic/react";
import axios from "axios";
import { calendar, checkmarkCircle, closeCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getCarList, registerCar } from "../../../actions/carActions";
import { displayDateFormate } from "../../../components/Services/DateFormat";
import "./AddCar.css";

const AddCar = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const [carName, setCarName] = useState("");
	const [carNumber, setCarNumber] = useState("");

	const [carRCTCNo, setCarRCTCNo] = useState("");

	const [RCNumber, setRCNumber] = useState("");

	const [PUCNumber, setPUCNumber] = useState("");
	const [PUCStartDate, setPUCStartDate] = useState("");
	const [PUCEndDate, setPUCEndDate] = useState("");

	const [insuranceNumber, setInsuranceNumber] = useState("");
	const [insuranceStartDate, setInsuranceStartDate] = useState("");
	const [insuranceEndDate, setInsuranceEndDate] = useState("");

	const [carFitnessStartDate, setCarFitnessStartDate] = useState("");
	const [carFitnessEndDate, setCarFitnessEndDate] = useState("");

	const [carPurchaseInvoice, setCarPurchaseInvoice] = useState("");
	const [carPurchaseInvoiceDate, setCarPurchaseInvoiceDate] = useState("");

	const [carImage, setCarImage] = useState("");
	const [carRCTCImage, setCarRCTCImage] = useState("");
	const [RCBookImage, setRCBookImage] = useState("");
	const [PUCImage, setPUCImage] = useState("");
	const [carFitnessImage, setCarFitnessImage] = useState("");
	const [insuranceImage, setInsuranceImage] = useState("");
	const [message, setMessage] = useState("");
	const [showToast, setShowToast] = useState(false);
	const [success, setSuccess] = useState(false);
	const [uploading, setUploading] = useState(false);
	const carRegister = useSelector((state) => state.carRegister);
	let { error, carInfo } = carRegister;

	useEffect(() => {
		dispatch(getCarList());
		if (carInfo) {
			if (Object.keys(carInfo).length !== 0) {
				setShowToast(true);
				setSuccess(true);
				setTimeout(() => {
					history.push(`/admin/CarsList?carInfo`);
				}, 1000);
			}
		} else if (error) {
			setShowToast(true);

			setSuccess(false);
			setMessage(error);
		}
	}, [error, carInfo, dispatch, history]);

	const submitHandler = async (e) => {
		dispatch(
			registerCar(
				carName,
				carNumber,
				carImage,
				carRCTCNo,
				carRCTCImage,
				RCNumber,
				RCBookImage,
				PUCNumber,
				PUCImage,
				PUCStartDate,
				PUCEndDate,
				insuranceNumber,
				insuranceImage,
				insuranceStartDate,
				insuranceEndDate,
				carFitnessImage,
				carFitnessStartDate,
				carFitnessEndDate,
				carPurchaseInvoice,
				carPurchaseInvoiceDate,
			),
		);

		e.preventDefault();
	};

	const validateCarNumber = (e) => {
		if (e.which === 32) {
			e.preventDefault();
		}
	};

	return (
		<>
			<IonContent class='grey'>
				<IonHeader>
					<IonToolbar>
						<IonButtons slot='start'>
							<IonMenuButton />
						</IonButtons>
						<IonTitle class='spx-font-color-black'> Add Car </IonTitle>
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
							handler: () => {
								window.location.reload();
							},
						},
					]}
				/>

				<IonCard className='blue-border'>
					<>
						<form onSubmit={submitHandler} className='ion-padding'>
							<IonRow>
								<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
									<IonInput
										onIonChange={(e) => setCarName(e.target.value)}
										placeholder='Enter Car Name'
										class='input-field'
										required
									/>
								</IonCol>
								<IonCol
									size='4'
									className='ion-align-self-center  ion-text-center'>
									<IonInput
										onIonChange={(e) => setCarNumber(e.target.value)}
										placeholder='Enter Car Number'
										onKeyPress={validateCarNumber}
										class='input-field'
										required
									/>
								</IonCol>

								<IonCol className='ion-align-self-center  ion-text-center'>
									<IonInput className='input-field' disabled>
										<input
											accept='image/*'
											onChange={async (e) => {
												if (carNumber !== "") {
													const file = e.target.files[0];
													var blob = file.slice(0, file.size, file.type);
													var newFile = new File(
														[blob],
														`${carName}_${carNumber}`,
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
															`/api/upload/car/profile/${carNumber}`,
															formData,
															config,
														);
														setCarImage(data);

														setUploading(false);
													} catch (error) {
														setUploading(false);
													}
												} else {
													setShowToast(true);
													setMessage("Please enter Car Number first...!");
													setSuccess(false);
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
											id='car-Image'
											className='input-field'
										/>
										<label for='car-Image'>Car Image</label>
									</IonInput>
								</IonCol>
								<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
							</IonRow>

							<div className='hr'></div>

							<IonRow>
								<IonCol className='ion-text-center'>
									<IonInput
										id='purchase-invoice-date'
										class='input-field '
										value={displayDateFormate(carPurchaseInvoiceDate)}
										placeholder='Car Purchase Invoice date'>
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
											max='2040'
											mode='md'
											slot='top'
											onIonChange={(ev) => {
												setCarPurchaseInvoiceDate(ev.target.value);
											}}
										/>
									</IonPopover>
								</IonCol>
								<IonCol className='ion-align-self-center ion-text-center'>
									<IonInput className='input-field' disabled>
										<input
											accept='image/*'
											onChange={async (e) => {
												const file = e.target.files[0];

												var blob = file.slice(0, file.size, file.type);
												var newFile = new File(
													[blob],
													`${carName}_${carNumber}_Purchase`,
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
														`/api/upload/car/profile/${carNumber}`,
														formData,
														config,
													);
													setCarPurchaseInvoice(data);
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
										<label for='purchase'>Choose Purchase Invoice Image</label>
									</IonInput>
								</IonCol>

								<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
							</IonRow>
							<div className='hr'></div>

							<IonRow>
								<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
									<IonInput
										onIonChange={(e) => setPUCNumber(e.target.value)}
										placeholder='Enter PUC Number'
										class='input-field'
									/>
								</IonCol>

								<IonCol className='ion-text-center '>
									<IonInput
										id='puc-start-date'
										class='input-field '
										value={displayDateFormate(PUCStartDate)}
										placeholder='PUC Start Date'>
										{" "}
										<IonButtons>
											<IonButton
												slot='start'
												fill='clear'
												size='small'
												id='open-puc-start-date'>
												<IonIcon icon={calendar} size='small' />
											</IonButton>
										</IonButtons>
									</IonInput>
									<IonPopover
										trigger='open-puc-start-date'
										class='m-20'
										showBackdrop={true}
										dismissOnSelect={false}>
										<IonDatetime
											presentation='date'
											max='2040'
											mode='md'
											slot='top'
											onIonChange={(ev) => {
												setPUCStartDate(ev.target.value);
											}}
										/>
									</IonPopover>
								</IonCol>
								<IonCol className='ion-text-center'>
									<IonInput
										id='puc-end-date'
										class='input-field '
										value={displayDateFormate(PUCEndDate)}
										placeholder='PUC End date'>
										{" "}
										<IonButtons>
											<IonButton
												slot='start'
												fill='clear'
												size='small'
												id='open-puc-end-date'>
												<IonIcon icon={calendar} size='small' />
											</IonButton>
										</IonButtons>
									</IonInput>
									<IonPopover
										trigger='open-puc-end-date'
										class='m-20'
										showBackdrop={true}
										dismissOnSelect={false}>
										<IonDatetime
											presentation='date'
											max='2040'
											mode='md'
											slot='top'
											min={PUCStartDate}
											onIonChange={(ev) => {
												setPUCEndDate(ev.target.value);
											}}
										/>
									</IonPopover>
								</IonCol>
								<IonCol className='ion-align-self-center  ion-text-center'>
									<IonInput className='input-field' disabled>
										<input
											accept='image/*'
											onChange={async (e) => {
												const file = e.target.files[0];
												var blob = file.slice(0, file.size, file.type);
												var newFile = new File(
													[blob],
													`${carName}_${carNumber}_PUC`,
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
														`/api/upload/car/profile/${carNumber}`,
														formData,
														config,
													);
													setPUCImage(data);

													setUploading(false);
												} catch (error) {
													setUploading(false);
												}
											}}
											placeholder='Enter PUC Image'
											style={{
												paddingTop: "7px",
												paddingBottom: "7px",
												paddingLeft: "7px",
											}}
											type='file'
											id='PUC'
										/>
										<label for='PUC'>PUC Image</label>
									</IonInput>
								</IonCol>
								<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
							</IonRow>
							<div className='hr'></div>

							<IonRow>
								<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
									<IonInput
										onIonChange={(e) => setInsuranceNumber(e.target.value)}
										placeholder='Enter Insurance Number'
										class='input-field'
									/>
								</IonCol>

								<IonCol className='ion-text-center'>
									<IonInput
										id='insurance-start-date'
										class='input-field '
										value={displayDateFormate(insuranceStartDate)}
										placeholder='Insurance Start Date'>
										{" "}
										<IonButtons>
											<IonButton
												slot='start'
												fill='clear'
												size='small'
												id='open-insurance-start-date'>
												<IonIcon icon={calendar} size='small' />
											</IonButton>
										</IonButtons>
									</IonInput>
									<IonPopover
										trigger='open-insurance-start-date'
										class='m-20'
										showBackdrop={true}
										dismissOnSelect={false}>
										<IonDatetime
											presentation='date'
											max='2040'
											mode='md'
											slot='top'
											onIonChange={(ev) => {
												setInsuranceStartDate(ev.target.value);
											}}
										/>
									</IonPopover>
								</IonCol>
								<IonCol className='ion-text-center'>
									<IonInput
										id='insurance-end-date'
										class='input-field '
										value={displayDateFormate(insuranceEndDate)}
										placeholder='Insurance Start Date'>
										{" "}
										<IonButtons>
											<IonButton
												slot='start'
												fill='clear'
												size='small'
												id='open-insurance-end-date'>
												<IonIcon icon={calendar} size='small' />
											</IonButton>
										</IonButtons>
									</IonInput>
									<IonPopover
										trigger='open-insurance-end-date'
										class='m-20'
										showBackdrop={true}
										dismissOnSelect={false}>
										<IonDatetime
											presentation='date'
											max='2040'
											mode='md'
											slot='top'
											min={insuranceStartDate}
											onIonChange={(ev) => {
												setInsuranceEndDate(ev.target.value);
											}}
										/>
									</IonPopover>
								</IonCol>
								<IonCol className='ion-align-self-center  ion-text-center'>
									<IonInput className='input-field' disabled>
										<input
											accept='image/*'
											onChange={async (e) => {
												const file = e.target.files[0];
												var blob = file.slice(0, file.size, file.type);
												var newFile = new File(
													[blob],
													`${carName}_${carNumber}_Insurance`,
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
														`/api/upload/car/profile/${carNumber}`,
														formData,
														config,
													);
													setInsuranceImage(data);

													setUploading(false);
												} catch (error) {
													setUploading(false);
												}
											}}
											placeholder='Enter PUC Image'
											type='file'
											style={{
												paddingTop: "7px",
												paddingBottom: "7px",
												paddingLeft: "7px",
											}}
											id='insurance'
										/>
										<label for='insurance'>Insurance Image</label>
									</IonInput>
								</IonCol>

								<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
							</IonRow>
							<div className='hr'></div>

							<IonRow>
								<IonCol className='ion-text-center'>
									<IonInput
										id='fitness-start-date'
										class='input-field '
										value={displayDateFormate(carFitnessStartDate)}
										placeholder='Fitness Crt. Start Date'>
										{" "}
										<IonButtons>
											<IonButton
												slot='start'
												fill='clear'
												size='small'
												id='open-fitness-start-date'>
												<IonIcon icon={calendar} size='small' />
											</IonButton>
										</IonButtons>
									</IonInput>
									<IonModal
										trigger='open-fitness-start-date'
										class='m-20'
										showBackdrop={true}
										initialBreakpoint={0.6}
										dismissOnSelect={false}>
										<IonDatetime
											presentation='date'
											max='2040'
											class='mlt-205'
											mode='ios'
											slot='top'
											onIonChange={(ev) => {
												setCarFitnessStartDate(ev.target.value);
											}}
										/>
									</IonModal>
								</IonCol>
								<IonCol className='ion-text-center'>
									<IonInput
										id='fitness-end-date'
										class='input-field '
										value={displayDateFormate(carFitnessEndDate)}
										placeholder='Fitness Crt. end Date'>
										{" "}
										<IonButtons>
											<IonButton
												slot='start'
												fill='clear'
												size='small'
												id='open-fitness-end-date'>
												<IonIcon icon={calendar} size='small' />
											</IonButton>
										</IonButtons>
									</IonInput>
									<IonModal
										trigger='open-fitness-end-date'
										class='m-20'
										initialBreakpoint={0.6}
										showBackdrop={true}
										dismissOnSelect={false}>
										<IonDatetime
											presentation='date'
											max='2040'
											mode='ios'
											slot='top'
											class='mlt-205'
											min={carFitnessStartDate}
											onIonChange={(ev) => {
												setCarFitnessEndDate(ev.target.value);
											}}
										/>
									</IonModal>
								</IonCol>
								<IonCol className='ion-align-self-center ion-text-center'>
									<IonInput className='input-field' disabled>
										<input
											accept='image/*'
											onChange={async (e) => {
												const file = e.target.files[0];
												var blob = file.slice(0, file.size, file.type);
												var newFile = new File(
													[blob],
													`${carName}_${carNumber}_Fitness`,
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
														`/api/upload/car/profile/${carNumber}`,
														formData,
														config,
													);
													setCarFitnessImage(data);

													setUploading(false);
												} catch (error) {
													setUploading(false);
												}
											}}
											placeholder='Enter PUC Name'
											type='file'
											style={{
												paddingTop: "7px",
												paddingBottom: "7px",
												paddingLeft: "7px",
											}}
											id='fitness'
										/>
										<label for='fitness'>Fitness Crt. Image</label>
									</IonInput>
								</IonCol>

								<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
							</IonRow>

							<div className='hr'></div>

							<IonRow className='ion-no-margin '>
								<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
									<IonInput
										onIonChange={(e) => setCarRCTCNo(e.target.value)}
										placeholder='Enter RC-TC Number'
										class='input-field'
									/>
								</IonCol>

								<IonCol className='ion-align-self-center ion-margin-start ion-text-center'>
									<IonInput class='input-field' disabled>
										<input
											accept='image/*'
											onChange={async (e) => {
												const file = e.target.files[0];
												var blob = file.slice(0, file.size, file.type);
												var newFile = new File(
													[blob],
													`${carName}_${carNumber}_RCTC`,
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
														`/api/upload/car/profile/${carNumber}`,
														formData,
														config,
													);
													setCarRCTCImage(data);

													setUploading(false);
												} catch (error) {
													setUploading(false);
												}
											}}
											placeholder='Enter TC-PC Name'
											type='file'
											style={{
												paddingTop: "7px",
												paddingBottom: "7px",
												paddingLeft: "7px",
											}}
										/>
										<label for='rctc'>RCTC Image</label>
									</IonInput>
								</IonCol>

								<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
							</IonRow>
							<div className='hr'></div>

							<IonRow>
								<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
									<IonInput
										onIonChange={(e) => setRCNumber(e.target.value)}
										placeholder='Enter RC Number'
										class='input-field'
									/>
								</IonCol>

								<IonCol className='ion-align-self-center ion-margin-start ion-text-center'>
									<IonInput className='input-field' disabled>
										<input
											accept='image/*'
											onChange={async (e) => {
												const file = e.target.files[0];
												var blob = file.slice(0, file.size, file.type);
												var newFile = new File(
													[blob],
													`${carName}_${carNumber}_RC`,
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
														`/api/upload/car/profile/${carNumber}`,
														formData,
														config,
													);
													setRCBookImage(data);

													setUploading(false);
												} catch (error) {
													setUploading(false);
												}
											}}
											placeholder='Enter RC Book Image'
											style={{
												paddingTop: "7px",
												paddingBottom: "7px",
												paddingLeft: "7px",
											}}
											type='file'
											id='rcbook'
										/>
										<label for='rcbook'>RC Book Image</label>
									</IonInput>
								</IonCol>

								<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
							</IonRow>

							<div className='hr'></div>
							<IonRow>
								<IonCol class='ion-text-center'>
									<IonButton type='submit'>Save</IonButton>
								</IonCol>
							</IonRow>
						</form>
					</>
				</IonCard>
			</IonContent>
		</>
	);
};

export default AddCar;
