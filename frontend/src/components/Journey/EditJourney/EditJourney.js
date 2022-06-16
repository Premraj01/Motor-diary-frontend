import {
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonDatetime,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonMenuButton,
	IonModal,
	IonPopover,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { format, parseISO } from "date-fns";
import { calendar, timerSharp } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getCarDetails } from "../../../actions/carActions";
import { getDriversList } from "../../../actions/driverActions";
import {
	getJourneyDetails,
	getJourneyList,
} from "../../../actions/journeyActions";

const EditJourney = () => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const [showModal, setModal] = useState(false);
	const [driver, setDriver] = useState("");
	const [carName, setCarName] = useState("");
	const [journeyDate, setJourneyDate] = useState("");
	const [journeyTime, setJourneyTime] = useState("");
	const [startDestination, setStartDestination] = useState("");
	const [endDestination, setEndDestination] = useState("");
	const [startReading, setStartReading] = useState("");
	const [endReading, setEndReading] = useState("");

	const [expenseType, setExpenseType] = useState("");
	const [expenseAmount, setExpenseAmount] = useState("");
	const [expenseRemark, setExpenseRemark] = useState("");
	// const [jounrneyStatus, setJounrneyStatus] = useState("");

	const driversList = useSelector((state) => state.driversList);
	const { loading, error, drivers } = driversList;

	const journeyDetails = useSelector((state) => state.journeyDetails);
	const {
		loading: journeyLoading,
		error: journeyError,
		journey,
	} = journeyDetails;
	const carDetails = useSelector((state) => state.carDetails);
	const { loading: carLoading, error: carError, car } = carDetails;

	useEffect(() => {
		dispatch(getDriversList());

		dispatch(getJourneyDetails(id));

		drivers.map((d) => {
			journey.map((j) => {
				if (d._id === j.driverId) {
					setDriver(d.firstName + " " + d.lastName);
					setJourneyDate(j.journeyDate);
					setJourneyTime(j.journeyTime);
					setStartDestination(j.startDestination);
					setEndDestination(j.endDestination);
					setStartReading(j.startReading);
					setEndReading(j.endReading);
					setExpenseType(j.expenseType);
					setExpenseAmount(j.expenseAmount);
					dispatch(getCarDetails(d.carId));
				}
			});
		});

		setCarName(car.carName + "-" + car.carNumber);
	}, [id, dispatch, car]);

	const submitHandler = () => {};
	const formatDate = (value) => {
		return format(parseISO(value), "dd/MM/yyyy");
	};
	return (
		<div className='groupList'>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Edit Journey </IonTitle>
				</IonToolbar>
				<IonCard>
					<IonRow>
						<IonCol>
							<IonItem>
								<IonLabel position='floating'>First Name</IonLabel>
								<IonInput placeholder={driver} value={driver} disabled />
							</IonItem>
						</IonCol>
						<IonCol>
							<IonItem>
								<IonLabel position='floating'>Car Used</IonLabel>
								<IonInput placeholder={carName} value={carName} disabled />
							</IonItem>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonItem>
								<IonInput
									id='date-input-2'
									value={journeyDate}
									onIonChange={(ev) => {
										setJourneyDate(formatDate(ev.target.value));
									}}
									placeholder='HH:MM AM/PM'
								/>
								<IonButton slot='start' fill='clear' id='open-date-input-2'>
									<IonIcon icon={calendar} />
									{/* <IonIcon icon={close} /> */}
								</IonButton>
							</IonItem>
						</IonCol>
						<IonCol>
							<IonItem>
								<IonInput
									id='time'
									value={journeyTime}
									placeholder='choose Journey Date...'
								/>
								<IonButton slot='start' fill='clear' id='open-time'>
									<IonIcon icon={timerSharp} />
									{/* <IonIcon icon={close} /> */}
								</IonButton>
								<IonPopover trigger='open-time' showBackdrop={false}>
									<IonDatetime
										presentation='time'
										onIonChange={(ev) => {
											setJourneyTime(ev.target.value);
										}}
									/>
								</IonPopover>
							</IonItem>
						</IonCol>
					</IonRow>
					<IonRow no-padding>
						<IonCol id='action'>
							<IonItem className='ion-no-padding'>
								<IonLabel position='floating'>From</IonLabel>
								<IonInput
									value={startDestination}
									placeholder={startDestination}></IonInput>
							</IonItem>
							<IonItem>
								<IonLabel position='floating'>To</IonLabel>
								<IonInput
									value={endDestination}
									placeholder={endDestination}></IonInput>
							</IonItem>
						</IonCol>
						<IonCol id='action'>
							<IonItem className='ion-no-padding'>
								<IonLabel position='floating'>Start Reading</IonLabel>
								<IonInput
									value={startReading}
									placeholder={startReading}></IonInput>
							</IonItem>
							<IonItem>
								<IonLabel position='floating'>End Reading</IonLabel>
								<IonInput
									value={endReading}
									placeholder={endReading}></IonInput>
							</IonItem>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonItem>
								<IonButton onClick={() => setModal(true)}>
									All Expenses
								</IonButton>
							</IonItem>
							<IonModal isOpen={showModal} onDidDismiss={() => setModal(false)}>
								<IonRow>
									<IonCol className='ion-text-right'>
										{" "}
										<FaWindowClose
											size={25}
											id='close'
											onClick={() => setModal(false)}
										/>{" "}
									</IonCol>
								</IonRow>
								<IonRow className='ion-text-center ion-padding-top'>
									<IonCol className='spx-bold'>Expense type</IonCol>
									<IonCol className='spx-bold'>Expense Amount</IonCol>
								</IonRow>
								<div className='hr'></div>

								<IonRow className='ion-text-center'>
									<IonCol>
										<IonLabel>{expenseType}</IonLabel>
									</IonCol>
									<IonCol>
										<IonLabel>{expenseAmount}</IonLabel>
									</IonCol>
								</IonRow>
							</IonModal>
						</IonCol>
					</IonRow>
				</IonCard>
			</IonHeader>
		</div>
	);
};

export default EditJourney;
