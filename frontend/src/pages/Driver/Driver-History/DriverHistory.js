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
	IonMenuButton,
	IonModal,
	IonPopover,
	IonRow,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { getJourneyDetails } from "../../../actions/journeyActions";
import {
	arrowBackCircleOutline,
	calendar,
	cloudDownloadSharp,
} from "ionicons/icons";
import { FaWindowClose } from "react-icons/fa";
import "./DriverHistory.css";
import { downloadFile } from "../../../actions/downloadFile";
import csv from "../../../Utils/Images/csv.png";
import { getDriverDetails } from "../../../actions/driverActions";
import {
	dateFormat,
	displayDateFormate,
} from "../../../components/Services/DateFormat";
import { Workbook } from "exceljs";
import fs from "file-saver";
import moment from "moment";

const DriverHistory = () => {
	const dispatch = useDispatch();
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const { id } = useParams();

	const [showModal, setShowModal] = useState(false);

	const journeyDetails = useSelector((state) => state.journeyDetails);
	const { journeys } = journeyDetails;

	const driverDetails = useSelector((state) => state.driverDetails);
	const { driver } = driverDetails;

	useState(() => {
		dispatch(getJourneyDetails(id));
		dispatch(getDriverDetails(id));
	}, [journeys, id]);

	const exportToCsv = (e) => {
		e.preventDefault();

		let workbook = new Workbook();

		let title = `${" "} ${" "} ${" "} ${" "}${" "} ${" "} ${" "} ${" "} ${" "}${" "} ${" "} ${" "} ${" "} ${" "}${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${"Trip History of"} ${
			driver.firstName
		} ${driver.lastName}`;

		// Headers for each column
		let reading = `${" "} ${" "} ${" "} ${" "}
		    Monthly reading:${driver.monthlyTripReading}
			${" "}`;

		let headers = [
			"Driver",
			"Date",
			"Description",
			"Trip KM",
			" Car",
			"Status",
		];

		// Convert users data to a csv
		let journey;
		let usersCsv = journeys.reduce((acc, journey) => {
			const {
				journeyDate,
				startDestination,

				startReading,
				endReading,
				status,
			} = journey.journey;

			const { carName } = journey.car;
			const { firstName, lastName } = journey.driver;
			let dest = startDestination.replace(/s+/g, "").trim();
			if (status !== "pending") {
				acc.push([
					`${firstName} ${lastName}`,
					`${displayDateFormate(journeyDate)}`,
					`${dest.replace(/,/g, "").trim()}`,
					`${endReading - startReading}`,
					carName,
					status,
				]);
			}
			return acc;
		}, []);

		let workSheet = workbook.addWorksheet("DriverHistory Data");

		let titleRow = workSheet.addRow([title]);
		titleRow.font = {
			name: "Roboto sans-serif",
			family: 4,
			size: 12,
			bold: true,
		};
		let monthlyR = workSheet.addRow([reading]);
		monthlyR.font = {
			name: "Roboto sans-serif",
			family: 4,
			size: 10,
		};

		workSheet.addRow([]);

		const driverCol = workSheet.getColumn(1);
		const dateCol = workSheet.getColumn(2);
		const tripCol = workSheet.getColumn(3);
		const carCol = workSheet.getColumn(5);

		driverCol.width = 20;
		dateCol.width = 15;
		tripCol.width = 40;
		carCol.width = 20;

		let headerRow = workSheet.addRow(headers);
		headerRow.eachCell((cell, number) => {
			cell.fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: { argb: "FFFFFF00" },
				bgColor: { argb: "FF0000FF" },
			};
			cell.border = {
				top: { style: "thin" },
				left: { style: "thin" },
				bottom: { style: "thin" },
				right: { style: "thin" },
			};
		});

		usersCsv.forEach((d) => {
			workSheet.addRow(d);
		});

		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			fs.saveAs(
				blob,
				`${journeys[0]?.driver.firstName} ${journeys[0]?.driver.lastName}_Trips.xlsx`,
			);
		});

		setShowModal(false);
	};

	return (
		<>
			{" "}
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle class='spx-font-color-black spx-bold'>
						Driver History
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent class='grey'>
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
						<IonCol>
							<IonLabel class='spx-font-color-black spx-font-16 spx-bold '>
								{driver.firstName} {driver.lastName}
							</IonLabel>
						</IonCol>
					</IonRow>

					<>
						<IonRow class='ml-20 mr-20'>
							<IonCol className='ion-align-self-center ion-text-center '>
								<IonInput
									id='search-start-date'
									class='input-field '
									value={displayDateFormate(startDate)}
									placeholder='Start Date...'>
									{" "}
									<IonButtons>
										<IonButton
											slot='start'
											fill='clear'
											size='small'
											id='open-search-start-date'>
											<IonIcon icon={calendar} size='small' />
										</IonButton>
									</IonButtons>
								</IonInput>
								<IonPopover
									trigger='open-search-start-date'
									class='m-20'
									showBackdrop={true}
									dismissOnSelect={false}>
									<IonDatetime
										presentation='date'
										mode='md'
										slot='top'
										onIonChange={(ev) => {
											setStartDate(ev.target.value);
										}}
									/>
								</IonPopover>
							</IonCol>
							<IonCol className='ion-align-self-center ion-text-center '>
								<IonInput
									id='search-end-date'
									class='input-field '
									value={displayDateFormate(endDate)}
									placeholder='End Date...'
									debounce={1000}
									onIonChange={() => {
										dispatch(
											getJourneyDetails(
												id,
												"",
												dateFormat(moment(startDate).subtract(1, "days")),
												dateFormat(endDate),
											),
										);
									}}>
									{" "}
									<IonButtons>
										<IonButton
											slot='start'
											fill='clear'
											size='small'
											id='open-search-end-date'>
											<IonIcon icon={calendar} size='small' />
										</IonButton>
									</IonButtons>
								</IonInput>
								<IonPopover
									trigger='open-search-end-date'
									class='m-20'
									showBackdrop={true}
									dismissOnSelect={false}>
									<IonDatetime
										presentation='date'
										mode='md'
										min={startDate}
										slot='top'
										onIonChange={(ev) => {
											setEndDate(ev.target.value);
										}}
									/>
								</IonPopover>
							</IonCol>
							<IonCol>
								<IonLabel class='ion-float-right'>
									<IonButton onClick={() => setShowModal(true)}>
										Download
										<IonIcon icon={cloudDownloadSharp} />
									</IonButton>
								</IonLabel>
							</IonCol>
							<IonModal isOpen={showModal}>
								<IonContent>
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
									<IonRow id='download'>
										<IonCol className=' ion-text-center'>
											<IonLabel className='spx-font-20 spx-bold download-label'>
												Download File As...
											</IonLabel>{" "}
										</IonCol>{" "}
									</IonRow>
									<IonRow id='download-Files'>
										<IonCol className='ion-text-center'>
											<img
												onClick={exportToCsv}
												style={{ cursor: "pointer" }}
												src={csv}
												alt='fuel'
											/>
										</IonCol>
									</IonRow>
								</IonContent>
							</IonModal>
						</IonRow>

						<div className='table-header ml-20 mr-20'>
							<div className='hr'></div>
							<IonRow className='spx-color-white'>
								<IonCol className='spx-bold' size='2'>
									Date & Time
								</IonCol>
								<IonCol className='spx-bold' size='4'>
									Description Trip
								</IonCol>
								<IonCol className='spx-bold' size='2'>
									Trip KM
								</IonCol>
								<IonCol className='spx-bold' size='2'>
									Car
								</IonCol>
								<IonCol className='spx-bold ion-text-center' size='2'>
									Status
								</IonCol>
							</IonRow>
							<div className='hr'></div>
						</div>
						<IonList class='dairy-card'>
							<IonGrid>
								{journeys.map((j, i) => {
									if (j.journey.status !== "pending") {
										return (
											<div className='ml-20 mr-20'>
												<IonRow
													className='ion-align-self-center  table history spx-font-color-black'
													key={j._id}>
													<IonCol size='2'>
														{displayDateFormate(j.journey.journeyDate)}
													</IonCol>
													<IonCol size='4'>{j.journey.startDestination}</IonCol>
													<IonCol security='2'>
														{j.journey.endReading - j.journey.startReading}
													</IonCol>
													<IonCol size='2'>
														{j.car.carName} - {j.car.carNumber}
													</IonCol>

													{j.journey.status === "accepted" ? (
														<IonCol class='ion-text-center' size='2'>
															<MdCheckCircle
																style={{ color: "green", fontSize: "1.5em" }}
															/>
														</IonCol>
													) : (
														<IonCol class='ion-text-center' size='2'>
															<MdCancel
																style={{ color: "red", fontSize: "1.5em" }}
															/>
														</IonCol>
													)}
												</IonRow>
												<div className='hr'></div>
											</div>
										);
									}
								})}
							</IonGrid>
						</IonList>
					</>
				</IonCard>
			</IonContent>
		</>
	);
};

export default DriverHistory;
