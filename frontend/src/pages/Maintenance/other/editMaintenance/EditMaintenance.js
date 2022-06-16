import {
	IonButton,
	IonButtons,
	IonCard,
	IonChip,
	IonCol,
	IonContent,
	IonDatetime,
	IonHeader,
	IonIcon,
	IonInput,
	IonLabel,
	IonMenuButton,
	IonModal,
	IonPopover,
	IonRow,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import {
	arrowBackCircleOutline,
	calendar,
	createOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
	getCarDetails,
	getCarMaintenance,
	updateMaintenance,
} from "../../../../actions/carActions";
import { displayDateFormate } from "../../../../components/Services/DateFormat";
import { CAR_UPDATE_MAINTENANCE_RESET } from "../../../../constants/carConstants";
import CalculateCost from "../CalculateCost";

const EditMaintenance = () => {
	const dispatch = useDispatch();
	const { carId, maintenanceId } = useParams();
	const [date, setDate] = useState("");
	const [paymentMode, setPaymentMode] = useState("");
	const [servicingCenterName, setServicingCenterName] = useState("");
	const [reading, setReading] = useState("");
	const [invoiceNumber, setInvoiceNumber] = useState("");
	const [CGST, setCGST] = useState("");
	const [SGST, setSGST] = useState("");
	const [maintenanceArr, setMaintenanceArr] = useState([]);
	const [amountAddition, setAmountAddition] = useState(0);
	const [message, setMessage] = useState("");
	const [showToast, setShowToast] = useState(false);
	const [success, setSuccess] = useState(false);
	const [totalAmount, setTotalAmount] = useState(0);

	const carDetails = useSelector((state) => state.carDetails);
	const {
		loading: carDetailsLoading,
		error: carDetailsError,
		car,
	} = carDetails;

	const carMaintenanceDetails = useSelector(
		(state) => state.carMaintenanceDetails,
	);
	const {
		loading: carMaintenanceDetailsLoading,
		error: carMaintenanceDetailsError,
		maintenance,
	} = carMaintenanceDetails;

	const carUpdateMaintenance = useSelector(
		(state) => state.carUpdateMaintenance,
	);
	const {
		loading: carUpdateMaintenanceLoading,
		error: carUpdateMaintenanceError,
		success: successUpdate,
	} = carUpdateMaintenance;

	useEffect(() => {
		if (successUpdate) {
			setShowToast(true);
			setSuccess(true);
			setMessage("Maintenance Updated Successfully..!!");
			dispatch({ type: CAR_UPDATE_MAINTENANCE_RESET });
		} else if (carUpdateMaintenanceError) {
			setSuccess(false);
			setMessage(carUpdateMaintenanceError);
		} else {
			if (!car.carName || car._id !== carId) {
				dispatch(getCarDetails(carId));
				dispatch(getCarMaintenance(carId, maintenanceId));
			} else {
				setDate(maintenance?.date);
				setServicingCenterName(maintenance?.servicingCenterName);
				setReading(maintenance?.reading);
				setInvoiceNumber(maintenance?.invoiceNumber);
				setMaintenanceArr(maintenance?.maintenances);
				setSGST(maintenance?.SGST);
				setCGST(maintenance?.CGST);
				setPaymentMode(maintenance?.paymentMode);
			}
		}
		setAmountAddition(
			maintenanceArr?.reduce((acc, cur) => acc + Number(cur.basicAmount), 0),
		);
	}, [dispatch, maintenance, successUpdate]);

	const calculatedAmount = (amount) => {
		setTotalAmount(amount);
	};

	const validateNumber = (e) => {
		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(e.charCode);
		if (e.keyCode !== 8 && !pattern.test(inputChar)) {
			e.preventDefault();
		}
	};

	const updateHandler = () => {
		dispatch(
			updateMaintenance(carId, maintenanceId, {
				date,
				reading,
				servicingCenterName,
				invoiceNumber,
				maintenance: maintenanceArr,
				CGST,
				SGST,
				paymentMode,
			}),
		);
	};

	return (
		<IonContent class='grey'>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle class='spx-font-color-black'>Edit Maintenance </IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonCard>
				<IonRow>
					<IonCol size='5'>
						<IonButton
							class='ion-no-margin'
							fill='clear'
							routerLink='/admin/carMaintenance'>
							<IonIcon icon={arrowBackCircleOutline} />
							Back
						</IonButton>
					</IonCol>
					<IonCol>
						<IonLabel class='spx-font-color-black spx-font-16'>
							Selected Car:{" "}
							<span className='success spx-font-18'>
								{car.carName + " " + car.carNumber}
							</span>
						</IonLabel>
					</IonCol>
				</IonRow>
				<form onSubmit={updateHandler}>
					<div className='hr'></div>
					<IonRow>
						<IonCol class='ion-margin-start ion-text-center'>
							<IonLabel class='spx-font-color-black'>Maintenance Date</IonLabel>
						</IonCol>
						<IonCol class='ion-margin-start ion-text-center'>
							<IonLabel class='spx-font-color-black'>Servicing Center</IonLabel>
						</IonCol>
						<IonCol class='ion-margin-start ion-text-center'>
							<IonLabel class='spx-font-color-black'>Odometer Reading</IonLabel>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol className='ion-align-self-center ion-text-center ion-padding'>
							<IonInput
								id='purchase-invoice-date'
								class='input-field '
								value={displayDateFormate(date)}
								placeholder='Maintenance Date...'
								required>
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
									value={date}
									slot='top'
									onIonChange={(ev) => {
										setDate(ev.target.value);
									}}
								/>
							</IonPopover>
						</IonCol>
						<IonCol className='ion-align-self-center ion-text-center'>
							{" "}
							<IonInput
								onIonChange={(e) => setServicingCenterName(e.target.value)}
								value={servicingCenterName}
								placeholder='Enter the payment mode'
								class='input-field'
								// required
							/>
						</IonCol>
						<IonCol className='ion-align-self-center  ion-text-center'>
							<>
								<IonInput
									onIonChange={(e) => setReading(e.target.value)}
									placeholder='Enter Odometer Reading'
									class='input-field'
									value={reading}
									onKeyPress={validateNumber}
									required
								/>
							</>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol size='4' class='ion-margin-start ion-text-center'>
							<IonLabel class='spx-font-color-black'>Invoice Number</IonLabel>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol
							size='4'
							className='ion-align-self-center ion-text-center ion-padding'>
							<IonInput
								onIonChange={(e) => setInvoiceNumber(e.target.value)}
								value={invoiceNumber}
								placeholder='Enter Invoice Number'
								class='input-field'
								required
							/>
						</IonCol>
					</IonRow>
					<div className='hr'></div>
					{/*
					<IonRow>
						<IonCol class='ion-align-self-center ion-margin-start '>
							<IonButton onClick={() => setShowModal(true)}>
								Add{" "}
								<IonIcon slot='end' ios={addCircleSharp} md={addCircleSharp} />
							</IonButton>
						</IonCol>
					</IonRow>
					<IonModal isOpen={showModal} backdropDismiss={false}>
						<IonRow>
							<IonCol className='ion-text-right'>
								{" "}
								<FaWindowClose
									size={25}
									id='close'
									onClick={() => setShowModal(false)}
								/>{" "}
							</IonCol>
						</IonRow>
						<AddMaintenanceType maintenance={maintenance} />
					</IonModal>
*/}

					<IonRow>
						<IonCol>
							<IonLabel class='spx-font-color-black'>Maintenances:</IonLabel>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol size='8'>
							{maintenanceArr?.map((m, i) => {
								return (
									<IonChip key={i}>
										<IonLabel>
											{m.type}-{m.basicAmount}
										</IonLabel>
										<IonIcon icon={createOutline} />
									</IonChip>
								);
							})}
						</IonCol>
					</IonRow>

					<div className='hr'></div>

					<IonRow>
						<IonCol class='ion-margin-start ion-text-center'>
							<IonLabel class='spx-font-color-black'>CGST</IonLabel>
						</IonCol>
						<IonCol class='ion-margin-start ion-text-center'>
							<IonLabel class='spx-font-color-black'>SGST</IonLabel>
						</IonCol>
						<IonCol class='ion-margin-start ion-text-center'>
							<IonLabel class='spx-font-color-black'>Payment Mode</IonLabel>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol className='ion-align-self-center ion-text-center ion-padding'>
							{" "}
							<IonInput
								onIonChange={(e) => setCGST(e.target.value)}
								value={CGST}
								placeholder='Enter the CGST'
								class='input-field'
								// required
							/>
						</IonCol>
						<IonCol className='ion-align-self-center ion-text-center ion-padding'>
							{" "}
							<IonInput
								onIonChange={(e) => setSGST(e.target.value)}
								value={SGST}
								placeholder='Enter the SGST'
								class='input-field'
								// required
							/>
						</IonCol>
						<IonCol className='ion-align-self-center ion-text-center ion-padding'>
							{" "}
							<IonInput
								onIonChange={(e) => setPaymentMode(e.target.value)}
								value={paymentMode.toUpperCase()}
								placeholder='Enter the payment mode'
								class='input-field'
								// required
							/>
						</IonCol>
					</IonRow>

					<div className='hr'></div>
					<IonRow>
						<IonCol>
							<CalculateCost
								SGST={SGST}
								CGST={CGST}
								basicAmount={amountAddition}
								totalAmount={totalAmount}
								calculatedAmount={calculatedAmount}
							/>
						</IonCol>
					</IonRow>
					<div className='hr'></div>

					<IonRow>
						<IonCol class='ion-text-center'>
							<IonButton className='ion-margin-top' type='submit'>
								Update
							</IonButton>
						</IonCol>
					</IonRow>
				</form>
			</IonCard>
		</IonContent>
	);
};

export default EditMaintenance;
