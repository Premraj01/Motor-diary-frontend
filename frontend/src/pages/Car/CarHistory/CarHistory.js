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
import {
	arrowBackCircleOutline,
	calendar,
	cloudDownloadSharp,
} from "ionicons/icons";
import fs from "file-saver";
import { Workbook } from "exceljs";
import React, { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getCarDetails } from "../../../actions/carActions";
import { downloadFile } from "../../../actions/downloadFile";
import { getJourneyDetails } from "../../../actions/journeyActions";
import {
	dateFormat,
	displayDateFormate,
} from "../../../components/Services/DateFormat";
import csv from "../../../Utils/Images/csv.png";
import moment from "moment";

const CarHistory = () => {
	const dispatch = useDispatch();
	const { id } = useParams();

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [keyword, setKeyword] = useState("");
	const [showModal, setShowModal] = useState(false);

	const journeyDetails = useSelector((state) => state.journeyDetails);
	const { loading, error, journeys } = journeyDetails;

	const carDetails = useSelector((state) => state.carDetails);
	const { car } = carDetails;

	useEffect(() => {
		dispatch(getJourneyDetails(id));
		dispatch(getCarDetails(id));
	}, [dispatch]);

	const exportToCsv = (e) => {
		e.preventDefault();
		let workbook = new Workbook();
		let title = `${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "}   ${"Movement of Vehicle"} ${
			journeys[0]?.car.carName
		}-${journeys[0]?.car.carNumber}`;

		// `${" "},${" "},${"Agrawwaal Telecomm Services Kasba Peth Pune-411011"} `,

		// Headers for each column
		let headers = [
			"sr.No",
			"Date",
			"Journey Description",
			"Start ODM Reading(KM)",
			"End ODM Reading(KM)",
			"Total Day Km Running(KM)",
			"Start Time",
			"End Time",
			"Total Hours",
			"Officer Signature",
		];

		// Convert users data to a csv
		let usersCsv = journeys.reduce((acc, journey, i) => {
			const {
				journeyDate,
				startReading,
				endReading,
				status,
				startDestination,
			} = journey.journey;

			if (status !== "pending" && status !== "rejected") {
				acc.push([
					`${i + 1}`,
					`${displayDateFormate(journeyDate)}`,
					`${startDestination.replace(/,/g, " ").trim()}`,
					`${startReading}`,
					`${endReading}`,
					`${endReading - startReading}`,
					10,
					8,
					10,
				]);
			}
			return acc;
		}, []);

		let totalKM = journeys.reduce(
			(acc, j) => acc + (j.journey.endReading - j.journey.startReading),
			0,
		);

		// let reading = [
		// 	`${" "}`,
		// 	`${" "}`,
		// 	`${" "}`,
		// 	`${" "}`,
		// 	`${"Total Running:"} ${totalReading}`,
		// ];

		let workSheet = workbook.addWorksheet("CarHistory Data");

		let titleRow = workSheet.addRow([title]);
		titleRow.font = {
			name: "Roboto sans-serif",
			family: 4,
			size: 12,
			bold: true,
		};

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
		workSheet.addRow([]);

		workSheet.addRow(["", "", "", "", "Total KM", `${totalKM}`]);

		workSheet.mergeCells("A4:B5");
		const dateCol = workSheet.getColumn(2);
		const tripCol = workSheet.getColumn(3);

		dateCol.width = 15;
		tripCol.width = 40;

		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			fs.saveAs(
				blob,
				`${journeys[0]?.car.carName}-${journeys[0]?.car.carNumber}_Trips.xlsx`,
			);
		});

		setShowModal(false);
	};

	return (
		<>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle class='spx-font-color-black spx-bold'>History</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent class='grey'>
				<IonCard class='blue-border'>
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
						<IonCol>
							<IonLabel class='spx-font-color-black spx-font-16 spx-bold '>
								{car.carName}-{car.carNumber}
							</IonLabel>
						</IonCol>
					</IonRow>
					<IonRow class='ml-20 mr-20'>
						<IonCol className='ion-align-self-center ion-text-center ' size='4'>
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
						<IonCol className='ion-align-self-center ion-text-center' size='4'>
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
							<IonCol className='spx-bold'>Date </IonCol>
							<IonCol className='spx-bold'>Journey Description</IonCol>
							<IonCol className='spx-bold'>Start ODM Reading</IonCol>
							<IonCol className='spx-bold'>End ODM Reading</IonCol>
							<IonCol className='spx-bold'>Total Day Km Running</IonCol>
							<IonCol className='spx-bold'> Start Time</IonCol>
							<IonCol className='spx-bold'> End Time</IonCol>
							<IonCol className='spx-bold'>Total Hours</IonCol>
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
												className='ion-align-self-center ion-no-margin table history spx-font-color-black'
												key={j._id}>
												{/* <IonCol>{j._id}</IonCol> */}
												<IonCol class='pb-14 pt-14'>
													{displayDateFormate(j.journey.journeyDate)}
												</IonCol>
												<IonCol>
													{j.journey.startDestination.replace(",", " ")}
												</IonCol>
												<IonCol>{j.journey.startReading}</IonCol>
												<IonCol>{j.journey.endReading}</IonCol>
												<IonCol>
													{j.journey.endReading - j.journey.startReading}
												</IonCol>

												<IonCol>10</IonCol>
												<IonCol>8</IonCol>
												<IonCol>10</IonCol>
											</IonRow>
											<div className='hr'></div>
										</div>
									);
								}
							})}
						</IonGrid>
					</IonList>
				</IonCard>
			</IonContent>
		</>
	);
};

export default CarHistory;
