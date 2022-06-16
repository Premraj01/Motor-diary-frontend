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
import { format, formatRelative, parseISO } from "date-fns";
import {
	arrowBackCircleOutline,
	calendar,
	checkmarkCircle,
	close,
	closeCircle,
	eye,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getCarDetails, getCarList, updateCar } from "../../actions/carActions";
import { displayDateFormate } from "../../components/Services/DateFormat";
import { CAR_UPDATE_RESET } from "../../constants/carConstants";

const EditCar = () => {
	const { id } = useParams();
	const dispatch = useDispatch();

	const [carName, setCarName] = useState("");
	const [carNumber, setCarNumber] = useState("");
	const [PUCNumber, setPUCNumber] = useState("");
	const [RCNumber, setRCNumber] = useState("");
	const [insuranceNumber, setInsuranceNumber] = useState("");
	const [message, setMessage] = useState("");
	const [showToast, setShowToast] = useState(false);
	const [success, setSuccess] = useState(false);
	const [uploading, setUploading] = useState(false);

	const [carStatus, setCarStatus] = useState();

	const [carImage, setCarImage] = useState("");
	const [carImageCopy, setCarImageCopy] = useState("");
	const [carRCTCImage, setCarRCTCImage] = useState("");
	const [carRCTCImageCopy, setCarRCTCImageCopy] = useState("");
	const [RCBookImage, setRCBookImage] = useState("");
	const [RCBookImageCopy, setRCBookImageCopy] = useState("");
	const [PUCImage, setPUCImage] = useState("");
	const [PUCImageCopy, setPUCImageCopy] = useState("");
	const [carFitnessImage, setCarFitnessImage] = useState("");
	const [carFitnessImageCopy, setCarFitnessImageCopy] = useState("");
	const [insuranceImage, setInsuranceImage] = useState("");
	const [insuranceImageCopy, setInsuranceImageCopy] = useState("");

	const [carPurchaseInvoice, setCarPurchaseInvoice] = useState("");
	const [carPurchaseInvoiceCopy, setCarPurchaseInvoiceCopy] = useState("");

	const [carRCTCNo, setCarRCTCNo] = useState("");
	const [PUCStartDate, setPUCStartDate] = useState("");
	const [PUCEndDate, setPUCEndDate] = useState("");

	const [insuranceStartDate, setInsuranceStartDate] = useState("");
	const [insuranceEndDate, setInsuranceEndDate] = useState("");

	const [carFitnessStartDate, setCarFitnessStartDate] = useState("");
	const [carFitnessEndDate, setCarFitnessEndDate] = useState("");
	const [carPurchaseInvoiceDate, setCarPurchaseInvoiceDate] = useState("");

	const [showCarImageModal, setShowCarImageModal] = useState(false);
	const [showPurchaseImageModal, setShowPurchaseImageModal] = useState(false);
	const [showPUCImageModal, setShowPUCImageModal] = useState(false);
	const [showInsuranceImageModal, setShowInsuranceImageModal] = useState(false);
	const [showFitnessImageModal, setShowFitnessImageModal] = useState(false);
	const [showRcTcImageModal, setShowRcTcImageModal] = useState(false);
	const [showRcImageModal, setShowRcImageModal] = useState(false);

	const carDetails = useSelector((state) => state.carDetails);
	const { loading, error, car } = carDetails;

	const carUpdate = useSelector((state) => state.carUpdate);
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate,
	} = carUpdate;

	useEffect(() => {
		dispatch(getCarList());
		if (successUpdate) {
			setShowToast(true);
			setSuccess(true);
			setMessage("Car Updated Successfully..!!");
			dispatch({ type: CAR_UPDATE_RESET });
		} else if (error) {
			setSuccess(false);
			setMessage(error);
		} else {
			if (!car.carName || car._id !== id) {
				dispatch(getCarDetails(id));
			} else {
				setCarName(car.carName);
				setCarNumber(car.carNumber);
				setCarImage(car.carImage);
				setCarImageCopy(car.carImage);

				setCarPurchaseInvoiceDate(car.carPurchaseInvoiceDate);
				setCarPurchaseInvoice(car.carPurchaseInvoice);
				setCarPurchaseInvoiceCopy(car.carPurchaseInvoice);
				setPUCStartDate(car.PUCStartDate);
				setPUCEndDate(car.PUCEndDate);
				setPUCNumber(car.PUCNumber);
				setPUCImage(car.PUCImage);
				setPUCImageCopy(car.PUCImage);
				setRCNumber(car.RCNumber);
				setInsuranceNumber(car.insuranceNumber);
				setInsuranceStartDate(car.insuranceStartDate);
				setInsuranceEndDate(car.insuranceEndDate);
				setInsuranceImage(car.insuranceImage);
				setInsuranceImageCopy(car.insuranceImage);
				setCarFitnessStartDate(car.carFitnessStartDate);
				setCarFitnessEndDate(car.carFitnessEndDate);

				setCarFitnessImage(car.carFitnessImage);
				setCarFitnessImageCopy(car.carFitnessImage);

				setCarRCTCNo(car.carRCTCNo);
				setCarRCTCImage(car.carRCTCImage);
				setCarRCTCImageCopy(car.carRCTCImage);
				setRCNumber(car.RCNumber);
				setRCBookImage(car.RCBookImage);
				setRCBookImageCopy(car.RCBookImage);
				setCarStatus(car.carStatus);
			}
		}
	}, [id, dispatch, car, successUpdate, error]);

	const submitHandler = (e) => {
		// e.preventDefault();
		dispatch(
			updateCar({
				_id: id,
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
				carStatus,
			}),
		);
	};

	return (
		<>
			{" "}
			{loading ? (
				<IonLoading
					isOpen={true}
					message={"Loading Car Details..."}></IonLoading>
			) : (
				<>
					<IonContent class='grey'>
						<IonHeader>
							<IonToolbar>
								<IonButtons slot='start'>
									<IonMenuButton />
								</IonButtons>
								<IonTitle class='spx-font-color-black'> Edit Car </IonTitle>
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
						<IonCard className='groupList blue-border'>
							<IonRow>
								<IonCol size='5'>
									<IonButton
										class='ion-no-margin'
										fill='clear'
										routerLink='/admin/CarsList'>
										<IonIcon icon={arrowBackCircleOutline} />
										Back
									</IonButton>
								</IonCol>
							</IonRow>
							<form onSubmit={submitHandler} className='ion-padding'>
								<IonRow class='ion'>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel>Car Name</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel>Car Number</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel>Car Image</IonLabel>
									</IonCol>
								</IonRow>
								<IonRow>
									<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
										<IonInput
											onIonChange={(e) => setCarName(e.target.value)}
											placeholder={carName}
											value={carName}
											class='input-field'
											required
										/>
									</IonCol>

									<IonCol className='ion-align-self-center ion-margin-start ion-text-center'>
										<IonInput
											onIonChange={(e) => setCarNumber(e.target.value)}
											placeholder={carNumber}
											value={carNumber}
											class='input-field'
											required
										/>
									</IonCol>
									{!carImageCopy ? (
										<IonCol className='ion-align-self-center ion-text-center'>
											<input
												accept='image/*'
												onChange={async (e) => {
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
														console.log(data);
														setCarImage(data);
														setUploading(false);
													} catch (error) {
														console.error(error);
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
												className='input-field'
											/>
										</IonCol>
									) : (
										<IonCol class='ion-align-self-center'>
											<IonIcon
												color='green'
												id='close'
												onClick={() => {
													setShowCarImageModal(true);
												}}
												icon={eye}
											/>

											<IonIcon
												color='red'
												id='close'
												onClick={() => {
													setCarImageCopy();
												}}
												icon={close}
											/>
											<IonModal isOpen={showCarImageModal}>
												<IonContent fullscreen>
													<IonToolbar class='closeIcon'>
														<IonRow class='ion-margin-bottom'>
															<IonCol class='ion-margin-end'>
																<FaWindowClose
																	class='ion-float-right'
																	size={25}
																	id='close'
																	onClick={() => {
																		setShowCarImageModal(false);
																	}}
																/>
															</IonCol>
														</IonRow>
													</IonToolbar>
													<IonRow>
														<IonCol>
															{" "}
															<IonLabel>Car Image</IonLabel>
														</IonCol>
													</IonRow>
													<IonRow>
														<IonCol>
															{" "}
															<img src={carImageCopy} alt='' />
														</IonCol>
													</IonRow>
												</IonContent>
											</IonModal>
										</IonCol>
									)}

									<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
								</IonRow>

								<div className='hr'></div>
								<IonRow>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											Purchase Date
										</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											Purchase Invoice
										</IonLabel>
									</IonCol>
								</IonRow>
								<IonRow>
									<IonCol className='ion-align-self-center '>
										<IonInput
											id='purchase-invoice-date'
											class='input-field'
											value={displayDateFormate(carPurchaseInvoiceDate)}>
											{" "}
											<IonButton
												slot='start'
												fill='clear'
												id='open-purchase-invoice-date'>
												<IonIcon
													icon={calendar}
													onIonChange={(ev) => {
														setCarPurchaseInvoiceDate(ev.target.value);
													}}
												/>
											</IonButton>
										</IonInput>
										<IonPopover
											trigger='open-purchase-invoice-date'
											class='m-20'
											showBackdrop={true}>
											<IonDatetime
												presentation='date'
												mode='md'
												slot='top'
												onIonChange={(ev) => {
													setCarPurchaseInvoiceDate(ev.target.value);
												}}
											/>
										</IonPopover>
									</IonCol>
									{!carPurchaseInvoiceCopy ? (
										<IonCol className='ion-align-self-center '>
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
														console.error(error);
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
												className='input-field'
											/>
										</IonCol>
									) : (
										<IonCol class='ion-align-self-center'>
											<IonIcon
												color='green'
												id='close'
												onClick={() => {
													setShowPurchaseImageModal(true);
												}}
												icon={eye}
											/>

											<IonIcon
												color='red'
												id='close'
												onClick={() => {
													setCarPurchaseInvoiceCopy();
												}}
												icon={close}
											/>
											<IonModal isOpen={showPurchaseImageModal}>
												<IonContent fullscreen>
													<IonToolbar class='closeIcon'>
														<IonRow class='ion-margin-bottom'>
															<IonCol class='ion-margin-end'>
																<FaWindowClose
																	class='ion-float-right'
																	size={25}
																	id='close'
																	onClick={() => {
																		setShowPurchaseImageModal(false);
																	}}
																/>
															</IonCol>
														</IonRow>
													</IonToolbar>
													<IonRow>
														<IonCol>
															{" "}
															<IonLabel>Car Purchase Invoice</IonLabel>
														</IonCol>
													</IonRow>
													<IonRow>
														<IonCol>
															{" "}
															<img src={carPurchaseInvoiceCopy} alt='' />
														</IonCol>
													</IonRow>
												</IonContent>
											</IonModal>
										</IonCol>
									)}

									<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
								</IonRow>
								<div className='hr'></div>
								<IonRow>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											PUC Crt. Number
										</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											PUC Start Date
										</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											PUC Expiry Date
										</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											PUC Crt. Image
										</IonLabel>
									</IonCol>
								</IonRow>
								<IonRow>
									<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
										<IonInput
											onIonChange={(e) => setPUCNumber(e.target.value)}
											placeholder={PUCNumber}
											value={PUCNumber}
											class='input-field'
										/>
									</IonCol>

									<IonCol className='ion-text-center'>
										<IonInput
											id='puc-start-date'
											class='input-field'
											value={displayDateFormate(PUCStartDate)}
											placeholder='PUC start date'>
											{" "}
											<IonButton
												slot='start'
												fill='clear'
												id='open-puc-start-date'>
												<IonIcon icon={calendar} />
												{/* <IonIcon icon={close} /> */}
											</IonButton>
										</IonInput>

										<IonPopover
											trigger='open-puc-start-date'
											showBackDro={true}>
											<IonDatetime
												presentation='date'
												onIonChange={(ev) => {
													setPUCStartDate(ev.target.value);
												}}
											/>
										</IonPopover>
									</IonCol>
									<IonCol className=' ion-text-center'>
										<IonInput
											id='puc-end-date'
											class='input-field'
											value={displayDateFormate(PUCEndDate)}
											placeholder='End Date...'>
											{" "}
											<IonButton
												slot='start'
												fill='clear'
												id='open-puc-end-date'>
												<IonIcon icon={calendar} />
												{/* <IonIcon icon={close} /> */}
											</IonButton>
										</IonInput>

										<IonPopover trigger='open-puc-end-date' showBackdrop={true}>
											<IonDatetime
												presentation='date'
												min={PUCStartDate}
												onIonChange={(ev) => {
													setPUCEndDate(ev.target.value);
												}}
											/>
										</IonPopover>
									</IonCol>
									{!PUCImageCopy ? (
										<IonCol className='ion-align-self-center ion-text-center'>
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
														console.error(error);
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
												className='input-field'
											/>
										</IonCol>
									) : (
										<IonCol class='ion-align-self-center'>
											<IonIcon
												color='green'
												id='close'
												onClick={() => {
													setShowPUCImageModal(true);
												}}
												icon={eye}
											/>

											<IonIcon
												id='close'
												color='red'
												onClick={() => {
													setPUCImageCopy();
												}}
												icon={close}
											/>
											<IonModal isOpen={showPUCImageModal}>
												<IonContent>
													<IonToolbar class='closeIcon'>
														<IonRow class='ion-margin-bottom'>
															<IonCol class='ion-margin-end'>
																<FaWindowClose
																	class='ion-float-right'
																	size={25}
																	onClick={() => {
																		setShowPUCImageModal(false);
																	}}
																/>
															</IonCol>
														</IonRow>
													</IonToolbar>
													<IonRow>
														<IonCol>
															{" "}
															<IonLabel>Car PUC</IonLabel>
														</IonCol>
													</IonRow>
													<IonRow>
														<IonCol>
															{" "}
															<img src={PUCImageCopy} alt='' />
														</IonCol>
													</IonRow>
												</IonContent>
											</IonModal>
										</IonCol>
									)}

									<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
								</IonRow>
								<div className='hr'></div>
								<IonRow>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											Insurance Crt. Number
										</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											Insurance Start Date
										</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											Insurance Expiry Date
										</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											Insurance Crt. Image
										</IonLabel>
									</IonCol>
								</IonRow>
								<IonRow>
									<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
										<IonInput
											onIonChange={(e) => setInsuranceNumber(e.target.value)}
											placeholder={insuranceNumber}
											value={insuranceNumber}
											class='input-field'
										/>
									</IonCol>

									<IonCol className='ion-text-center'>
										<IonInput
											id='insurance-start-date'
											class='input-field'
											value={displayDateFormate(insuranceStartDate)}
											placeholder='Start Date...'>
											{" "}
											<IonButton
												slot='start'
												fill='clear'
												id='open-insurance-start-date'>
												<IonIcon icon={calendar} />
												{/* <IonIcon icon={close} /> */}
											</IonButton>
										</IonInput>

										<IonPopover
											trigger='open-insurance-start-date'
											showBackDro={true}>
											<IonDatetime
												presentation='date'
												onIonChange={(ev) => {
													setInsuranceStartDate(ev.target.value);
												}}
											/>
										</IonPopover>
									</IonCol>
									<IonCol className=' ion-text-center'>
										<IonInput
											id='insurance-end-date'
											class='input-field'
											value={displayDateFormate(insuranceEndDate)}
											placeholder='End Date...'>
											{" "}
											<IonButton
												slot='start'
												fill='clear'
												id='open-insurance-end-date'>
												<IonIcon icon={calendar} />
												{/* <IonIcon icon={close} /> */}
											</IonButton>
										</IonInput>

										<IonPopover
											trigger='open-insurance-end-date'
											showBackDro={true}>
											<IonDatetime
												presentation='date'
												min={insuranceStartDate}
												onIonChange={(ev) => {
													setInsuranceEndDate(ev.target.value);
												}}
											/>
										</IonPopover>
									</IonCol>
									{!insuranceImageCopy ? (
										<IonCol className='ion-align-self-center ion-text-center'>
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
														console.error(error);
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
												className='input-field'
											/>
										</IonCol>
									) : (
										<IonCol class='ion-align-self-center'>
											<IonIcon
												color='green'
												id='close'
												onClick={() => {
													setShowInsuranceImageModal(true);
												}}
												icon={eye}
											/>

											<IonIcon
												id='close'
												color='red'
												onClick={() => {
													setInsuranceImageCopy();
												}}
												icon={close}
											/>
											<IonModal isOpen={showInsuranceImageModal}>
												<IonContent fullscreen>
													<IonToolbar class='closeIcon'>
														<IonRow class='ion-margin-bottom'>
															<IonCol class='ion-margin-end'>
																<FaWindowClose
																	class='ion-float-right'
																	size={25}
																	onClick={() => {
																		setShowInsuranceImageModal(false);
																	}}
																/>
															</IonCol>
														</IonRow>
													</IonToolbar>
													<IonRow>
														<IonCol>
															{" "}
															<IonLabel>Car Insurance Image</IonLabel>
														</IonCol>
													</IonRow>
													<IonRow>
														<IonCol>
															{" "}
															<img src={insuranceImageCopy} alt='' />
														</IonCol>
													</IonRow>
												</IonContent>
											</IonModal>
										</IonCol>
									)}

									<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
								</IonRow>
								<div className='hr'></div>
								<IonRow>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											Fitness Crt. Start Date
										</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											Fitness Crt. Expiry Date
										</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											Fitness Crt. Image
										</IonLabel>
									</IonCol>
								</IonRow>
								<IonRow>
									<IonCol className='ion-text-center'>
										<IonInput
											id='fitness-start-date'
											class='input-field'
											value={displayDateFormate(carFitnessStartDate)}
											placeholder='Start Date...'>
											{" "}
											<IonButton
												slot='start'
												fill='clear'
												id='open-fitness-start-date'>
												<IonIcon icon={calendar} />
											</IonButton>
										</IonInput>

										<IonPopover
											trigger='open-fitness-start-date'
											showBackdrop={true}
											side='top'>
											<IonDatetime
												presentation='date'
												onIonChange={(ev) => {
													setCarFitnessStartDate(ev.target.value);
												}}
											/>
										</IonPopover>
									</IonCol>
									<IonCol className=' ion-text-center'>
										<IonInput
											id='fitness-end-date'
											class='input-field'
											value={displayDateFormate(carFitnessEndDate)}
											placeholder='End Date...'>
											{" "}
											<IonButton
												slot='end'
												fill='clear'
												id='open-fitness-end-date'>
												<IonIcon icon={calendar} />
											</IonButton>
										</IonInput>

										<IonPopover
											trigger='open-fitness-end-date'
											showBackdrop={true}
											side='top'>
											<IonDatetime
												presentation='date'
												min={carFitnessStartDate}
												onIonChange={(ev) => {
													setCarFitnessEndDate(ev.target.value);
												}}
											/>
										</IonPopover>
									</IonCol>
									{!carFitnessImageCopy ? (
										<IonCol className='ion-align-self-center ion-text-center'>
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
														console.error(error);
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
												className='input-field'
											/>
										</IonCol>
									) : (
										<IonCol class='ion-align-self-center'>
											<IonIcon
												id='close'
												color='green'
												onClick={() => {
													setShowFitnessImageModal(true);
												}}
												icon={eye}
											/>

											<IonIcon
												id='close'
												color='red'
												onClick={() => {
													setCarFitnessImageCopy();
												}}
												icon={close}
											/>
											<IonModal isOpen={showFitnessImageModal}>
												<IonContent>
													<IonToolbar class='closeIcon'>
														<IonRow class='ion-margin-bottom'>
															<IonCol class='ion-margin-end'>
																<FaWindowClose
																	class='ion-float-right'
																	size={25}
																	onClick={() => {
																		setShowFitnessImageModal(false);
																	}}
																/>
															</IonCol>
														</IonRow>
													</IonToolbar>
													<IonRow>
														<IonCol>Car Fitness CRT.</IonCol>
													</IonRow>

													<IonRow>
														<IonCol>
															<img src={carFitnessImageCopy} alt='' />
														</IonCol>
													</IonRow>
												</IonContent>
											</IonModal>
										</IonCol>
									)}

									<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
								</IonRow>

								<div className='hr'></div>
								<IonRow>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											RC-TC Number
										</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											RC-TC Image
										</IonLabel>
									</IonCol>
								</IonRow>
								<IonRow className='ion-no-margin '>
									<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
										<IonInput
											onIonChange={(e) => setCarRCTCNo(e.target.value)}
											value={carRCTCNo}
											placeholder='Enter RC-TC Number'
											class='input-field'
										/>
									</IonCol>

									{!carRCTCImageCopy ? (
										<IonCol className='ion-align-self-center ion-text-center'>
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
														console.log(data);
														setCarRCTCImage(data);

														setUploading(false);
													} catch (error) {
														console.error(error);
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
												className='input-field'
											/>
										</IonCol>
									) : (
										<IonCol class='ion-align-self-center'>
											<IonIcon
												color='green'
												id='close'
												onClick={() => {
													setShowRcTcImageModal(true);
												}}
												icon={eye}
											/>

											<IonIcon
												id='close'
												color='red'
												onClick={() => {
													setCarRCTCImageCopy();
												}}
												icon={close}
											/>
											<IonModal isOpen={showRcTcImageModal}>
												<IonContent fullscreen>
													<IonToolbar class='closeIcon'>
														<IonRow class='ion-margin-bottom'>
															<IonCol class='ion-margin-end'>
																<FaWindowClose
																	class='ion-float-right'
																	onClick={() => setShowRcTcImageModal(false)}
																	size={25}
																/>
															</IonCol>
														</IonRow>
													</IonToolbar>
													<IonRow>
														<IonCol>RC-TC Image</IonCol>
													</IonRow>
													<IonRow>
														<IonCol>
															<img src={carRCTCImageCopy} alt='' />
														</IonCol>
													</IonRow>
												</IonContent>
											</IonModal>
										</IonCol>
									)}

									<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
								</IonRow>
								<div className='hr'></div>
								<IonRow>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>RC Number</IonLabel>
									</IonCol>
									<IonCol class='spx-font-color-black ion-align-self-center ion-text-center ion-no-padding spx-font-color-black'>
										<IonLabel class='spx-font-color-black'>
											RC book Image
										</IonLabel>
									</IonCol>
								</IonRow>
								<IonRow>
									<IonCol className='ion-align-self-center ion-text-center ion-no-padding'>
										<IonInput
											onIonChange={(e) => setRCNumber(e.target.value)}
											value={RCNumber}
											placeholder='Enter RC Number'
											class='input-field'
										/>
									</IonCol>
									{!RCBookImageCopy ? (
										<IonCol className='ion-align-self-center ion-text-center'>
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
														console.error(error);
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
												className='input-field'
											/>
										</IonCol>
									) : (
										<IonCol class='ion-align-self-center'>
											<IonIcon
												color='green'
												id='close'
												onClick={() => {
													setShowRcImageModal(true);
												}}
												icon={eye}
											/>

											<IonIcon
												id='close'
												color='red'
												onClick={() => {
													setRCBookImageCopy();
												}}
												icon={close}
											/>
											<IonModal
												isOpen={showRcImageModal}
												backdropDismiss={false}>
												<IonContent fullscreen>
													<IonToolbar class='closeIcon'>
														<IonRow class='ion-margin-bottom'>
															<IonCol class='ion-margin-end'>
																<FaWindowClose
																	class='ion-float-right'
																	size={25}
																	onClick={() => {
																		setShowRcImageModal(false);
																	}}
																/>
															</IonCol>
														</IonRow>
													</IonToolbar>
													<IonRow>
														<IonCol>RC Image</IonCol>
													</IonRow>
													<IonRow>
														<IonCol>
															<img src={RCBookImageCopy} alt='' />
														</IonCol>
													</IonRow>
												</IonContent>
											</IonModal>
										</IonCol>
									)}{" "}
									<IonLoading isOpen={uploading} spinner='bubbles'></IonLoading>
								</IonRow>
								<div className='hr'></div>

								<IonRow>
									<IonCol class='ion-text-center'>
										<IonButton
											className='ion-margin-top'
											routerLink='/admin/CarsList'
											type='submit'>
											Update
										</IonButton>
									</IonCol>
								</IonRow>
							</form>
						</IonCard>
					</IonContent>
				</>
			)}
		</>
	);
};

export default EditCar;
