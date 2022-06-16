import {
	IonAlert,
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
	IonItem,
	IonLabel,
	IonList,
	IonMenuButton,
	IonModal,
	IonPopover,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { calendar, cloudDownloadSharp, eye, star } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { FaTrash, FaWindowClose } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteFuelWithId,
	getCarDetails,
	getCarList,
	getCarReading,
} from "../../actions/carActions";
import csv from "../../Utils/Images/csv.png";
import { downloadFile } from "../../actions/downloadFile";
import "./FuelMainrenance.scss";
import {
	dateFormat,
	displayDateFormate,
} from "../../components/Services/DateFormat";
import { BsFileEarmarkX } from "react-icons/bs";
import moment from "moment";
import fs from "file-saver";
import { Workbook } from "exceljs";

const FuelMaintenance = () => {
	const [selectCar, setSelectCar] = useState("");

	const [showModal, setShowModal] = useState(false);
	const [showReceiptModal, setShowReceiptModal] = useState(false);
	const [carFuel, setCarFuel] = useState([]);
	const [startMonthReading, setStartMonthReading] = useState("");
	const [endMonthReading, setEndMonthReading] = useState("");
	const [fuelDeleteCarId, setFuelDeleteCarId] = useState("");

	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const [fuelDeleteId, setFuelDeleteId] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [modalCar, setModalCar] = useState("");

	const dispatch = useDispatch();
	const carList = useSelector((state) => state.carList);
	const { cars } = carList;
	const carDetails = useSelector((state) => state.carDetails);
	const { car } = carDetails;
	const carReading = useSelector((state) => state.carReading);
	const { reading } = carReading;

	const deleteFuel = useSelector((state) => state.deleteFuel);
	const { success: deleteSuccess } = deleteFuel;

	useEffect(() => {
		dispatch(getCarList());

		searchMaintenance();
	}, [dispatch, selectCar, car]);

	const deleteFuelHandler = (fuelDeleteCarId, fuelDeleteId) => {
		dispatch(deleteFuelWithId(fuelDeleteCarId, fuelDeleteId));
		window.location.reload();
	};

	const exportToCsv = (e) => {
		console.log(reading);
		let workbook = new Workbook();
		let totalAmount = 0;
		let totalFuel = 0;

		carFuel.map((car) => {
			totalAmount = totalAmount + car.amount;
			totalFuel = totalFuel + car.quantity;
		});

		let title = `${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${"Fuel Maintenance "}`;
		let subTitle = `${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${"Fuel Maintenance for"} ${
			selectCar?.carName
		}-${selectCar?.carNumber}`;

		let headers = ["Date", " ", "Reading", "Amount", "Fuel Qty(liter)"];

		// Convert users data to a csv
		let usersCsv = carFuel?.reduce((acc, car, i) => {
			acc.push([
				`${displayDateFormate(car?.date)}`,
				` `,
				`${car?.reading}`,
				`${car?.amount}`,
				`${car?.quantity}`,
			]);
			return acc;
		}, []);

		let workSheet = workbook.addWorksheet("Fuel Data");

		let titleRow = workSheet.addRow([title]);
		titleRow.font = {
			name: "Roboto sans-serif",
			family: 4,
			size: 12,
			bold: true,
		};

		let headerDescription = workSheet.addRow([subTitle]);
		headerDescription.font = {
			name: "Roboto sans-serif",
			family: 4,
			size: 8,
		};

		workSheet.addRow([]);

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

		const dateCol = workSheet.getColumn(1);

		dateCol.width = 15;

		usersCsv.forEach((d) => {
			let row = workSheet.addRow(d);
			let qty = row.getCell(5);
		});

		let footerTotal = [" ", "Total", "", `${totalAmount}`, `${totalFuel}`];
		let footerStart = [
			" ",
			"",
			"",
			"Start Km",
			`${reading?.readings?.startReading}`,
		];
		let footerEnd = [" ", "", "", "End Km", `${reading?.readings?.endReading}`];

		let footerTotalReading = [
			" ",
			"",
			"",
			"Total Reading",
			`${reading?.readings?.endReading - reading?.readings?.startReading}`,
		];

		console.log(
			"-->",
			reading?.readings?.endReading - reading?.readings?.startReading,
			reading?.readings?.endReading,
			reading?.readings?.startReading,
		);
		let footerAvg = [
			" ",
			"",
			"",
			"Average",
			`${(
				(reading?.readings?.endReading - reading?.readings?.startReading) /
				totalFuel
			).toFixed(2)}`,
		];

		workSheet.addRow(footerTotal);
		workSheet.addRow([]);
		workSheet.addRow(footerStart);
		workSheet.addRow(footerEnd);
		workSheet.addRow(footerTotalReading);
		workSheet.addRow(footerAvg);

		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			fs.saveAs(
				blob,
				`${selectCar?.carName}-${selectCar?.carNumber}_Maintenance_History.xlsx`,
			);
		});

		setShowModal(false);
	};

	const sortFuelByDate = () => {
		carFuel?.sort((a, b) => {
			return moment(b?.date, "DD-MM-YYYY").diff(moment(a?.date, "DD-MM-YYYY"));
		});
		console.log(carFuel);
	};

	const searchMaintenance = () => {
		if (startDate !== "" && endDate !== "") {
			let start = moment(startDate).subtract(1, "days");
			let carArr = [];
			selectCar?.fuelMaintenance.forEach((fuel) => {
				if (dateFormat(start) <= dateFormat(fuel.date)) {
					if (dateFormat(endDate) >= dateFormat(fuel.date)) {
						carArr.push(fuel);
					}
				}
			});

			setCarFuel(carArr);
			sortFuelByDate();
		} else {
			setCarFuel(selectCar?.fuelMaintenance);
			sortFuelByDate();
		}
	};

	return (
		<IonContent class='grey'>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle class='spx-font-color-black spx-bold'>
						Fuel History{" "}
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<>
				<IonGrid id='select-car'>
					<IonRow>
						<IonCol className='ion-align-self-center ion-text-center table  '>
							<IonItem>
								<IonLabel>
									{selectCar
										? selectCar?.carName + "-" + selectCar?.carNumber
										: "Select Car"}
								</IonLabel>
								<IonSelect
									onIonChange={(ev) => {
										setSelectCar(ev.target.value);
										searchMaintenance();
									}}>
									{cars.map((c) => {
										return (
											<IonSelectOption value={c} key={c._id}>
												{c.carName + "-" + c.carNumber}
											</IonSelectOption>
										);
									})}
								</IonSelect>
							</IonItem>
						</IonCol>
					</IonRow>
				</IonGrid>
			</>
			{selectCar ? (
				<IonCard class='blue-border '>
					{carFuel?.length !== 0 ? (
						<>
							<IonGrid>
								<IonRow>
									<IonCol className='ion-align-self-center ion-text-center ml-20'>
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
												max='2040'
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
												searchMaintenance();
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
												max='2040'
												slot='top'
												onIonChange={(ev) => {
													dispatch(
														getCarReading(
															dateFormat(startDate),
															dateFormat(ev.target.value),
															selectCar._id,
														),
													);
													setEndDate(ev.target.value);
												}}
											/>
										</IonPopover>
									</IonCol>

									<IonCol class='mr-20'>
										<IonLabel class='ion-float-right'>
											<IonButton
												disabled={endDate ? false : true}
												onClick={() => {
													// dispatch(getCarDetails(selectCar?._id));
													setShowModal(true);
												}}>
												Download
												<IonIcon icon={cloudDownloadSharp} />
											</IonButton>
										</IonLabel>
									</IonCol>
									<IonModal isOpen={showModal} backdropDismiss={false}>
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
								<div className='table-header mr-20 ml-20'>
									<div className='hr'></div>
									<IonRow className='ion-align-self-center ion-no-margin ion-text-center table  spx-color-white'>
										<IonCol className='spx-bold'>Amount</IonCol>
										<IonCol className='spx-bold'>Date</IonCol>
										<IonCol className='spx-bold'>Reading(in KM)</IonCol>
										<IonCol className='spx-bold'>Quantity(in litre)</IonCol>
										<IonCol className='spx-bold ion-float-left'>Action</IonCol>
									</IonRow>
									<div className='hr'></div>
								</div>
								<IonList class='dairy-card ion-no-padding'>
									<IonGrid>
										{carFuel?.map((m, i) => {
											return (
												<div className='ml-20 mr-20'>
													<IonRow className='ion-text-center table ion-no-margin  spx-font-color-black'>
														<IonCol>
															<IonLabel className='spx-bold'>
																{m.amount}
															</IonLabel>
														</IonCol>
														<IonCol className='spx-bold'>
															{displayDateFormate(m.date)}
														</IonCol>
														<IonCol className='spx-bold'>{m.reading}</IonCol>
														<IonCol className='spx-bold'>{m.quantity}</IonCol>
														<IonCol id='action' class='ion-text-center'>
															<IonRow>
																<IonCol>
																	<IonIcon
																		id='close'
																		onClick={() => {
																			setModalCar(m);
																			setShowReceiptModal(true);
																		}}
																		icon={eye}
																	/>

																	<IonModal
																		isOpen={showReceiptModal}
																		backdropDismiss={false}>
																		<IonContent>
																			<IonRow>
																				<IonToolbar class='closeIcon'>
																					<IonRow class='ion-margin-bottom'>
																						<IonCol class='ion-margin-end'>
																							<FaWindowClose
																								class='ion-float-right'
																								size={25}
																								id='close'
																								onClick={() => {
																									setShowReceiptModal(false);
																								}}
																							/>
																						</IonCol>
																						<IonCol></IonCol>
																					</IonRow>
																				</IonToolbar>
																			</IonRow>

																			<IonRow>
																				<IonCol className='ion-text-center'>
																					<IonRow>
																						<IonCol>
																							<img
																								src={modalCar.odometerImage}
																								alt='fuel'
																							/>
																						</IonCol>
																					</IonRow>
																				</IonCol>
																				<div className='vl'></div>
																				<IonCol className=' ion-text-center'>
																					<IonRow>
																						<IonCol>
																							<img
																								src={modalCar.fuelReceiptImage}
																								alt='fuel'
																							/>
																						</IonCol>
																					</IonRow>
																				</IonCol>
																				<IonCol>
																					<IonRow>
																						<IonCol className='ion-text-center'>
																							<img
																								src={
																									modalCar.fuelBillReceiptCopyImage
																								}
																								alt='fuel'
																							/>
																						</IonCol>
																					</IonRow>
																				</IonCol>
																			</IonRow>
																		</IonContent>
																	</IonModal>
																</IonCol>

																<IonCol>
																	<button>
																		<FaTrash
																			className='danger'
																			onClick={() => {
																				setShowDeleteAlert(true);
																				setFuelDeleteId(m._id);
																				setFuelDeleteCarId(selectCar._id);
																			}}
																		/>
																	</button>
																	<IonAlert
																		isOpen={showDeleteAlert}
																		onDidDismiss={() =>
																			setShowDeleteAlert(false)
																		}
																		cssClass='my-custom-class'
																		message={`This expense will be <strong>DELETED..!</strong>`}
																		buttons={[
																			{
																				text: "Cancel",
																				role: "cancel",
																				cssClass: "secondary",
																				id: "cancel-button",
																			},
																			{
																				text: "Okay",
																				id: "confirm-button",
																				handler: () => {
																					deleteFuelHandler(
																						fuelDeleteCarId,
																						fuelDeleteId,
																					);
																				},
																			},
																		]}
																	/>
																</IonCol>
															</IonRow>
														</IonCol>
													</IonRow>
													<div className='hr'></div>
												</div>
											);
										})}
									</IonGrid>
								</IonList>
							</IonGrid>
						</>
					) : (
						<>
							<IonRow>
								<IonCol class='ion-text-center'>
									<IonRow>
										<IonCol class='ion-text-center'>
											<BsFileEarmarkX size={100} />
										</IonCol>
									</IonRow>
									<IonLabel class='spx-bold'>
										Fuel Maintenance is not added by any driver!
									</IonLabel>
								</IonCol>
							</IonRow>
						</>
					)}
				</IonCard>
			) : (
				<div className='div-size msg-div'>
					<IonGrid>
						<IonRow>
							<IonCol class='ion-text-center'>
								<IonLabel class='spx-bold spx-font-color-black spx-font-24'>
									{" "}
									Please Select car to see the Fuel Maintenances.
								</IonLabel>
							</IonCol>
						</IonRow>
					</IonGrid>
				</div>
			)}
		</IonContent>
	);
};

export default FuelMaintenance;
