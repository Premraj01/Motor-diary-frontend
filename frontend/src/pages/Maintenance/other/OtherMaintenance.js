import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCardHeader,
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
import {
	addCircleSharp,
	calendar,
	cloudDownloadSharp,
	downloadSharp,
	listCircle,
	listCircleOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import {
	FaWindowClose,
	FaRegEdit,
	FaDownload,
	FaRupeeSign,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import fs from "file-saver";
import { Workbook } from "exceljs";
import csv from "../../../Utils/Images/csv.png";
import { downloadFile } from "../../../actions/downloadFile";
import { getCarDetails, getCarList } from "../../../actions/carActions";
import { Link } from "react-router-dom";
import {
	dateFormat,
	displayDateFormate,
} from "../../../components/Services/DateFormat";
import "./maintenance.css";
import { AiOutlineFileAdd } from "react-icons/ai";
import moment from "moment";

const FuelMaintenance = () => {
	const [selectCar, setSelectCar] = useState("");

	const [showModal, setShowModal] = useState(false);
	const [maintenanceModal, setMaintenanceModal] = useState(false);
	const [carMaintenanceTypes, setCarMaintenanceTypes] = useState([]);
	const [maintenancesList, setMaintenancesList] = useState();

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const dispatch = useDispatch();
	const carList = useSelector((state) => state.carList);
	const { loading, error, cars } = carList;
	const carDetails = useSelector((state) => state.carDetails);
	const {
		loading: carDetailsLoading,
		error: carDetailsError,
		car,
	} = carDetails;

	useEffect(() => {
		dispatch(getCarList());
		searchMaintenance();
	}, [dispatch, selectCar, car]);

	const exportToCsv = (carObj) => {
		let workbook = new Workbook();

		let title = `           ${"Fuel Maintenance of"} ${selectCar.carName}-${
			selectCar.carNumber
		}`;

		let descriptionCenter = [
			// `${"Servicing Details"}`,
			// `${"Vehicle Details"}`,
			`${" "}`,
			`Service Center Name:${carObj.servicingCenterName}`,

			// ,`Invoice No:${carObj.invoiceNumber}`,
			// `Service Center GSTIN:,${" "}`,`Invoice Date:${displayDateFormate(
			// 	carObj.date,
			// )}`,
			// `${" "},Odometer:${carObj.reading}Km,${" "},Vehicle Reg.:${
			// 	selectCar.carNumber
			// }`,
			// ` `,
		];

		let headers = [
			"sr.No",
			"Details of Service",
			"HSN SAC",
			"Unit Price",
			"Qty",
			"Final Price",
		];

		let usersCsv = carObj.maintenances.reduce((acc, car, i) => {
			acc.push([
				`${i + 1}`,
				`${car.type}`,
				` `,
				`${car.basicAmount}`,
				`1.0`,
				`${car.basicAmount}`,
			]);
			return acc;
		}, []);

		let totalAmount = [
			`${" "}`,
			`${" "}`,
			`${" "}`,
			`${"CGST"}:${carObj.CGST}%`,
			`${"SGST"}:${carObj.SGST}%`,
			`${"Total"}:${carObj.totalAmount}`,
		];

		let workSheet = workbook.addWorksheet("Maintenance Data");

		let titleRow = workSheet.addRow([title]);
		titleRow.font = {
			name: "Roboto sans-serif",
			family: 4,
			size: 12,
			bold: true,
		};

		let headerDescription = workSheet.addRow(descriptionCenter);
		headerDescription.font = {
			name: "Roboto sans-serif",
			family: 4,
			size: 8,
		};
		workSheet.mergeCells("B2:C2");

		workSheet.getCell("D2").value = `Servicing Date:${displayDateFormate(
			carObj.date,
		)}`;
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

		const serviceCol = workSheet.getColumn(2);

		serviceCol.width = 20;

		usersCsv.forEach((d) => {
			let row = workSheet.addRow(d);
			let qty = row.getCell(5);
		});

		workSheet.addRow([]);
		let footer = workSheet.addRow(totalAmount);

		footer.font = {
			name: "Roboto sans-serif",
			family: 4,
			size: 10,
		};

		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			fs.saveAs(
				blob,
				`${selectCar.carName}-${selectCar.carNumber}_Maintenance_History.xlsx`,
			);
		});

		setShowModal(false);
	};

	const searchMaintenance = () => {
		if (startDate !== "" && endDate !== "") {
			let carArr = [];
			let start = moment(startDate).subtract(1, "days");
			selectCar?.carMaintenance.forEach((fuel) => {
				if (dateFormat(start) < dateFormat(fuel.date)) {
					if (dateFormat(endDate) > dateFormat(fuel.date)) {
						carArr.push(fuel);
					}
				}
			});
			setCarMaintenanceTypes(carArr);
		} else {
			setCarMaintenanceTypes(selectCar?.carMaintenance);
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
						Car Maintenance{" "}
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<>
				<IonGrid id='select-car'>
					<IonRow>
						<IonCol className='ion-align-self-center ion-text-center table'>
							<IonItem>
								<IonLabel>
									{selectCar
										? selectCar?.carName + "-" + selectCar?.carNumber
										: "Select Car"}
								</IonLabel>
								<IonSelect onIonChange={(ev) => setSelectCar(ev.target.value)}>
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
				<IonCard class='blue-border'>
					{carMaintenanceTypes?.length !== 0 ? (
						<>
							{" "}
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
												max='2040'
												slot='top'
												onIonChange={(ev) => {
													setStartDate(ev.target.value);
												}}
											/>
										</IonPopover>
									</IonCol>
									<IonCol className='ion-align-self-center ion-text-center'>
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
													setEndDate(ev.target.value);
												}}
											/>
										</IonPopover>
									</IonCol>

									<IonCol class='mr-20'>
										<IonLabel>
											<Link to={`/admin/carMaintenance/add/${selectCar._id}`}>
												<IonButton class='ion-float-right'>
													Add Maintenance{" "}
													<IonIcon
														slot='end'
														ios={addCircleSharp}
														md={addCircleSharp}
													/>
												</IonButton>
											</Link>
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
													<IonRow>
														<IonCol>
															<img onClick={exportToCsv} src={csv} alt='fuel' />
														</IonCol>
													</IonRow>
													<IonRow>
														<IonCol className='ion-text-center'></IonCol>
													</IonRow>
												</IonCol>
												<div className='vl'></div>
												<IonCol className=' ion-text-center'></IonCol>
											</IonRow>
										</IonContent>
									</IonModal>
								</IonRow>
								<div className='ml-20 mr-20 table-header'>
									<div className='hr'></div>
									<IonRow className='spx-color-white'>
										<IonCol className='spx-bold'>Date</IonCol>
										<IonCol className='spx-bold'>Reading(Km)</IonCol>
										<IonCol className='spx-bold'>Servicing Center</IonCol>
										<IonCol className='spx-bold'>Invoice Number</IonCol>
										<IonCol className='spx-bold'>Tax</IonCol>
										<IonCol className='spx-bold'>Payment Mode</IonCol>
										<IonCol className='spx-bold ion-text-center'>Action</IonCol>
									</IonRow>
									<div className='hr'></div>
								</div>
								<IonList class='dairy-card ion-no-padding'>
									<IonGrid>
										{carMaintenanceTypes?.map((m, i) => {
											return (
												<IonRow className='ml-20 mr-20 ion-no-margin'>
													<>
														<IonCol className='spx-font-color-black'>
															{displayDateFormate(m.date)}
														</IonCol>
														<IonCol>{m.reading}</IonCol>

														<IonCol className='spx-font-color-black'>
															{m.servicingCenterName}
														</IonCol>
														<IonCol className='spx-font-color-black'>
															{m.invoiceNumber}
														</IonCol>
														<IonCol>
															<IonLabel className='spx-font-color-black'>
																CGST:<span className='spx-bold'>{m.CGST}%</span>
															</IonLabel>
															<br />
															<IonLabel className='spx-font-color-black'>
																SGST:<span className='spx-bold'>{m.SGST}%</span>
															</IonLabel>
														</IonCol>

														<IonCol>{m.paymentMode.toUpperCase()}</IonCol>

														<IonCol class='ion-text-center'>
															<IonRow>
																<IonCol size='4' class='ion-no-padding '>
																	<IonIcon
																		icon={listCircle}
																		onClick={() => {
																			setMaintenanceModal(true);
																			setMaintenancesList(m);
																		}}
																		style={{
																			cursor: "pointer",
																		}}
																		class='spx-font-20 ion-float-right spx-font-color-black'></IonIcon>
																</IonCol>
																<IonCol
																	size='4'
																	class='ion-text-center ion-no-padding '>
																	<FaDownload
																		style={{
																			cursor: "pointer",
																		}}
																		className='spx-font-color-black'
																		size={20}
																		onClick={() => {
																			exportToCsv(m);
																		}}></FaDownload>
																</IonCol>
																<IonCol size='4' class='ion-no-padding'>
																	<Link
																		to={`/admin/car/othermaintenance/edit/${selectCar._id}/${m._id}`}>
																		<FaRegEdit
																			style={{
																				cursor: "pointer",
																				color: "black",
																			}}
																			className='ion-float-left'
																			size={24}></FaRegEdit>
																	</Link>
																</IonCol>
															</IonRow>

															<IonModal
																isOpen={maintenanceModal}
																initialBreakpoint={1}
																backdropDismiss={false}>
																<IonToolbar class='closeIcon'>
																	<IonRow class='ion-margin-bottom'>
																		<IonCol class='ion-margin-end'>
																			<FaWindowClose
																				class='ion-float-right'
																				size={25}
																				id='close'
																				onClick={() => {
																					setMaintenanceModal(false);
																				}}
																			/>
																		</IonCol>
																	</IonRow>
																</IonToolbar>
																<>
																	<IonLabel class='ion-margin-top'>
																		Total Amount:
																		<FaRupeeSign size={14} />
																		<span className='spx-bold'>
																			{" "}
																			{maintenancesList?.totalAmount}
																		</span>
																	</IonLabel>
																	<div className='hr'></div>
																	<IonRow>
																		<IonCol className='spx-bold ion-text-center'>
																			sr.No
																		</IonCol>
																		<IonCol className='spx-bold  ion-text-center'>
																			Type
																		</IonCol>
																		<IonCol className='spx-bold  ion-text-center'>
																			Amount
																		</IonCol>
																	</IonRow>
																	<div className='hr'></div>

																	<IonList class='dairy-card'>
																		<IonGrid>
																			{maintenancesList?.maintenances?.map(
																				(mt, i) => {
																					return (
																						<IonRow
																							id={i % 2 === 0 && "grey"}
																							className='ion-align-self-center ion-text-center table  spx-font-color-black'>
																							<IonCol>{i + 1}</IonCol>
																							<IonCol>{mt?.type}</IonCol>
																							<IonCol>{mt?.basicAmount}</IonCol>
																						</IonRow>
																					);
																				},
																			)}
																		</IonGrid>
																	</IonList>
																</>
															</IonModal>
														</IonCol>
													</>
												</IonRow>
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
											<AiOutlineFileAdd size={100} />
										</IonCol>
									</IonRow>
									<IonLabel class='spx-bold'>
										No maintenances! Please add some maintenances{" "}
										<Link to={`/admin/carMaintenance/add/${selectCar._id}`}>
											<IonLabel>Add Maintenance</IonLabel>
										</Link>
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
									Please Select car to see the Other Maintenances.
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
