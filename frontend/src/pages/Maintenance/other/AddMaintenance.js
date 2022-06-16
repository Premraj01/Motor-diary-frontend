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
import { format, parseISO } from "date-fns";
import {
	addCircleSharp,
	arrowBackCircleOutline,
	calendar,
	closeCircle,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { addMaintenance, getCarDetails } from "../../../actions/carActions";
import { displayDateFormate } from "../../../components/Services/DateFormat";
import AddMaintenanceType from "./AddMaintenanceType";
import CalculateCost from "./CalculateCost";
import "./maintenance.css";

const AddMaintenance = () => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const [maintenanceTypes, setMaintenanceTypes] = useState([]);
	const [date, setDate] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [reading, setReading] = useState(0);
	const [CGST, setCGST] = useState(0);
	const [SGST, setSGST] = useState(0);
	const [invoiceNumber, setInvoiceNumber] = useState("");

	const [totalAmount, setTotalAmount] = useState(0);
	const [amountAddition, setAmountAddition] = useState(0);

	const [paymentMode, setPaymentMode] = useState("");
	const [servicingCenterName, setServicingCenterName] = useState("");
	const carDetails = useSelector((state) => state.carDetails);
	const { car } = carDetails;

	useEffect(() => {
		dispatch(getCarDetails(id));
		setAmountAddition(
			maintenanceTypes?.reduce((acc, cur) => acc + Number(cur.basicAmount), 0),
		);
	}, [dispatch, id, maintenanceTypes]);

	const validateNumber = (e) => {
		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(e.charCode);
		if (e.keyCode !== 8 && !pattern.test(inputChar)) {
			e.preventDefault();
		}
	};

	const maintenance = (list) => {
		setMaintenanceTypes([...maintenanceTypes, list]);
	};

	const submitHandler = () => {
		dispatch(
			addMaintenance({
				carId: id,
				date,
				reading,
				paymentMode,
				totalAmount,
				servicingCenterName,
				invoiceNumber,
				CGST,
				SGST,
				maintenanceTypes,
			}),
		);
		setDate("");
		setReading(0);
	};

	const removeMaintenance = (m) => {
		setMaintenanceTypes(maintenanceTypes.filter((main) => main !== m));
	};

	const calculatedAmount = (amount) => {
		setTotalAmount(amount);
	};

	return (
		<IonContent class='grey'>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle class='spx-font-color-black'>Add Maintenance </IonTitle>
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
				<form onSubmit={submitHandler}>
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
									max='2040'
									slot='top'
									onIonChange={(ev) => {
										setDate(ev.target.value);
									}}
								/>
							</IonPopover>
						</IonCol>
						<IonCol className='ion-align-self-center ion-text-center ion-padding'>
							<IonInput
								onIonChange={(e) => setServicingCenterName(e.target.value)}
								value={servicingCenterName}
								placeholder='Servicing Center Name'
								class='input-field'
								// required
							/>
						</IonCol>
						<IonCol className='ion-align-self-center ion-text-center ion-padding'>
							<>
								<IonInput
									onIonChange={(e) => setReading(e.target.value)}
									value={reading}
									placeholder='Enter Odometer Reading'
									class='input-field'
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
					<IonRow>
						<IonCol class='ion-align-self-center ion-margin-start '>
							<IonButton onClick={() => setShowModal(true)} disabled={!date}>
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

					{maintenanceTypes.length > 0 && (
						<IonCol size='8'>
							{maintenanceTypes.map((m, i) => {
								return (
									<IonChip key={i}>
										<IonLabel>
											{m.type}-{m.basicAmount}
										</IonLabel>
										<IonIcon
											icon={closeCircle}
											class='danger'
											style={{
												cursor: "pointer",
											}}
											onClick={() => removeMaintenance(m)}
										/>
									</IonChip>
								);
							})}
						</IonCol>
					)}
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
								value={paymentMode}
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
							<IonButton
								className='ion-margin-top'
								type='submit'
								disabled={maintenanceTypes.length <= 0}>
								Add Details
							</IonButton>
						</IonCol>
					</IonRow>
				</form>
			</IonCard>
		</IonContent>
	);
};

export default AddMaintenance;
