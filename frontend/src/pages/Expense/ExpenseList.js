import React, { useEffect, useState } from "react";
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
	IonLoading,
	IonMenuButton,
	IonModal,
	IonPopover,
	IonRow,
	IonSearchbar,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteExpense,
	deleteExpenseWithId,
	getExpense,
	updateExpense,
	updateExpenseDepartment,
} from "../../actions/expenseAction";
import { downloadFile } from "../../actions/downloadFile";

import { BsFileEarmarkX } from "react-icons/bs";
import { calendar, cloudDownloadSharp, eye } from "ionicons/icons";
import { FaTrash, FaWindowClose } from "react-icons/fa";
import csv from "../../Utils/Images/csv.png";
import "./ExpenseList.css";

import {
	dateFormat,
	displayDateFormate,
} from "../../components/Services/DateFormat";
import { Workbook } from "exceljs";
import fs from "file-saver";
import departmentList from "../../actions/departmentsList";
import moment from "moment";

const ExpenseList = () => {
	const dispatch = useDispatch();

	const [showModal, setShowModal] = useState(false);
	const [expenseImage, setExpenseImage] = useState("");
	const [showDownloadModal, setShowDownloadModal] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [keyword, setKeyword] = useState("");
	const [status, setStatus] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [expense, setExpense] = useState("");
	const [statusId, setStatusId] = useState("");
	const [driver, setDriver] = useState("");
	const [loader, setLoader] = useState(false);

	const expenseList = useSelector((state) => state.expenseList);
	const { expenses } = expenseList;

	const updateDepartment = useSelector((state) => state.updateDepartment);
	const { success } = updateDepartment;

	useEffect(() => {
		dispatch(getExpense());
	}, [dispatch, endDate, startDate]);

	const updateDepartmentHandler = (e, ex) => {
		dispatch(updateExpenseDepartment(ex._id, e.target.value)).then(() => {
			dispatch(getExpense());
		});
	};

	const exportToCsv = (e) => {
		let workbook = new Workbook();
		let title = `${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "} ${" "}${" "} ${" "} ${" "} ${" "} ${"Driver Expenses"}${" "}`;

		let headers = [
			"Driver",
			"Date",
			"Expense Type",
			"Department",
			"Expense Amount",
		];

		let usersCsv = expenses.reduce((acc, ex, i) => {
			if (ex.status === "accepted") {
				acc.push([
					`${ex.driver.firstName} ${ex.driver.lastName}`,
					`${displayDateFormate(ex.date)}`,
					`${ex.expenseType.toString().replace(",", " ")}`, // `${ex.expenseType}`,,
					`${ex.department === "" ? "-" : ex.department}`,
					`${ex.expenseAmount}`,
				]);
			}
			return acc;
		}, []);

		let workSheet = workbook.addWorksheet("Expense Data");

		let titleRow = workSheet.addRow([title]);
		titleRow.font = {
			name: "Roboto sans-serif",
			family: 4,
			size: 12,
			bold: true,
		};

		workSheet.addRow([]);

		const driverCol = workSheet.getColumn(1);
		const dateCol = workSheet.getColumn(2);
		const tripCol = workSheet.getColumn(3);
		const departmentCol = workSheet.getColumn(4);

		driverCol.width = 20;
		dateCol.width = 15;
		tripCol.width = 30;
		departmentCol.width = 30;

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
			let row = workSheet.addRow(d);
			let qty = row.getCell(5);
		});

		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			fs.saveAs(blob, `Expense_List.xlsx`);
		});

		setShowDownloadModal(false);
	};

	const updateExpenseStatus = (expense, status, statusId) => {
		dispatch(updateExpense(expense, status, statusId)).then(() => {
			dispatch(getExpense());
		});
	};

	return (
		<IonContent class='grey'>
			<IonLoading isOpen={loader} message={"Please wait..."}></IonLoading>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle class='spx-font-color-black spx-bold'>Expenses</IonTitle>
				</IonToolbar>
			</IonHeader>
			<>
				<IonCard class='blue-border'>
					{expenses?.length !== 0 ? (
						<>
							<IonRow>
								<IonCol class='ml-20'>
									<IonSearchbar
										value={keyword}
										placeholder='Search Driver'
										debounce={1000}
										onIonChange={(e) => {
											setKeyword(e.target.value);
											dispatch(getExpense(e.target.value, null, null));
										}}></IonSearchbar>
								</IonCol>
								<IonCol className='ion-align-self-center '>
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
								<IonCol className='ion-align-self-center '>
									<IonInput
										id='search-end-date'
										class='input-field '
										value={displayDateFormate(endDate)}
										placeholder='End Date...'
										debounce={1000}
										onIonChange={() => {
											dispatch(
												getExpense(
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
											max='2040'
											slot='top'
											onIonChange={(ev) => {
												setEndDate(ev.target.value);
											}}
										/>
									</IonPopover>
								</IonCol>
								<IonCol class='ion-align-self-center  mr-20'>
									<IonButton
										class='ion-float-right'
										onClick={() => {
											setShowDownloadModal(true);
										}}>
										Download
										<IonIcon icon={cloudDownloadSharp} />
									</IonButton>
								</IonCol>
								<IonModal isOpen={showDownloadModal} backdropDismiss={false}>
									<IonContent fullscreen>
										<IonToolbar class='closeIcon'>
											<IonRow class='ion-margin-bottom'>
												<IonCol class='ion-margin-end'>
													<FaWindowClose
														class='ion-float-right'
														size={25}
														id='close'
														onClick={() => {
															setShowDownloadModal(false);
														}}
													/>
												</IonCol>
											</IonRow>
										</IonToolbar>
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

												{/* <DownloadCsv data={expenses} filename={"text.csv"} /> */}
											</IonCol>
										</IonRow>
									</IonContent>
								</IonModal>
							</IonRow>

							<div className='table-header ml-20 mr-20'>
								<div className='hr'></div>
								<IonRow className='ion-align-self-center spx-color-white '>
									<IonCol size='2' className='spx-bold ion-text-center'>
										Driver
									</IonCol>
									<IonCol size='2' className='spx-bold '>
										Date
									</IonCol>
									<IonCol size='2' className='spx-bold ion-text-center'>
										Type{" "}
									</IonCol>
									<IonCol size='1' className='spx-bold ion-text-center'>
										Amount
									</IonCol>
									<IonCol size='3' className='spx-bold ion-text-center '>
										Department
									</IonCol>
									<IonCol size='2' className='spx-bold ion-text-center'>
										Action
									</IonCol>
								</IonRow>
								<div className='hr'></div>
							</div>

							<IonList class='dairy-card ion-no-padding'>
								<IonGrid class='ion-align-self-center  spx-font-color-black '>
									{expenses.map((ex, i) => {
										return (
											<div className='ml-20 mr-20'>
												<IonRow
													key={ex._id}
													class='ion-align-item-center ion-no-margin'>
													<IonCol size='2'>
														<IonLabel>
															{" "}
															{ex.driver?.firstName} {ex.driver?.lastName}{" "}
														</IonLabel>
													</IonCol>

													<IonCol size='2'>
														<IonLabel>{displayDateFormate(ex.date)}</IonLabel>
													</IonCol>
													<IonCol size='2'>
														<IonLabel>{ex.expenseType}</IonLabel>
													</IonCol>
													<IonCol size='1' class='ion-text-center '>
														<IonLabel>{ex.expenseAmount}</IonLabel>
													</IonCol>
													{ex?.department ? (
														<IonCol size='3' class=' ion-text-center'>
															<IonLabel>{ex?.department}</IonLabel>
														</IonCol>
													) : (
														<IonCol size='3' class='ion-text-center'>
															<IonRow>
																<IonCol size='2'></IonCol>
																<IonCol size='8'>
																	<IonItem lines='none'>
																		<IonSelect
																			class='ion-padding'
																			placeholder='Choose'
																			style={{
																				height: "20px",
																				width: "100%",
																				background: "rgb(208, 225, 241)",
																				borderRadius: "5px",
																			}}
																			onIonChange={(e) => {
																				updateDepartmentHandler(e, ex);
																			}}>
																			{departmentList.map((d, i) => {
																				return (
																					<IonSelectOption value={d} key={i}>
																						{d}
																					</IonSelectOption>
																				);
																			})}
																		</IonSelect>
																	</IonItem>
																</IonCol>
																<IonCol size='2'></IonCol>
															</IonRow>
														</IonCol>
													)}

													<IonCol size='2' class=' ion-text-center'>
														{/* <IonRow>
															<IonCol class='ion-text-center'>
																<div>
																	<IonIcon
																		id='close'
																		onClick={() => {
																			setShowModal(true);
																			setExpenseImage(ex.expenseReceiptImage);
																		}}
																		icon={eye}
																	/>
																</div>
															</IonCol>

															{ex.status === "pending" ? (
																<IonCol class='ion-text-center'>
																	<img
																		alt='accept'
																		onClick={() => {
																			setStatus("accepted");
																			setExpense(ex);

																			setStatusId(ex._id);
																			setShowAlert(true);
																		}}
																		src='https://img.icons8.com/color/48/000000/checked--v4.png'
																	/>
																	<img
																		alt='reject'
																		onClick={() => {
																			setStatus("rejected");
																			setStatusId(ex._id);

																			setExpense(ex);
																			setShowAlert(true);
																		}}
																		src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAE+ElEQVRoge2ZTWxUVRTHf2fevDdTygBVHLZgDLiqLdCStKNMEJvospBUKo2LbqCQICohxrDCEKMoIcbKookffFgSYGmjEVM0EVrEoisgRnSFUIXSVmDem3nXxbRA570372OGxkV/q8m9Z+45/9yPc+59MMccc5RDqjnYRFtLmnx+LUJDDJYrSCPUAmAzKcKoDVdARjDMM6mBkdFq+a5YyFgmU6clzc2i6AJWhxhTIQwrJYfzhdzRusGLY5XEEVnIWCZTF0+au1H0AKlKggDGQX1sFaz3ogqKJGRy3ZouRO0H0lH+X4broN6Yf/r80bB/DCVktLU1VZOwDiF0hnUUCuHwnfy8nvTg4GTwvwRkoq0lLQVrAGRltOhCIlxQsfhLqW9+vBHMPABFEfnvgRUVBReey8qwng1yusX8DEZbW1PFmZh1EQArxNS/Um31tX6GvkJqkvneWVtO7qz+t5Do8zMqK2Ry3ZouUJurF1NU5OXJ9c1lDxjPPTKWydTFE+Ylqn/ERuW6VTCf9soznjMST5q7+f+IAFgS14xdXp2uQsYymToUW8N40Rqb0Ns7Atvr7R1ojU1hXCCw7Va2YZFbX9w1qKS5GcWCoA60+kaSe9+HZA0kklhffl7WXt+wCWPra5DLcW/PmxR+Hg7qamFc0zuB3tIO1xmZKgADodU3ktx3oCgCMLp70De96ml/XwRAIkFy7360lc1B3QHiGptDyERbS5piFRuI2FPL74uYxujuQd/oPGT0jZ0PREyTSBBbuiyoOwTWjGdXLXbE4bC0rSwhShfr1HHMTw442o0tO2bMjL5hE8aWHQ47s68X69TxoO4ARLR4trTRuUeUPBNmVADrZD8AxtadM9qN7p7iD9N0zgRTIvrL7ycP6oETDzc4hEzd7ELjK6aECkQgSjnKJcfSUrAk0ugUxbgts1IqEQGAKEd+czu15kf34C+mYhFFHKnBt2iMRpmzoqrPHQ9wExL4VubGjDzhgl+eCch4aYNDiMD1qKP7iZimYjFKHLdGh5Diu1N4vESYfb3ueaYCMUrkcmmbSx7hYth1XE7Ewxvb62j2q80cCL+UNjn3SMIaBAKnEr29w13EoYMzRFgn+zEPHXTYGd09oapmwFb5/JnSRoeQ1MDIKELgctT+7Qrq7t0ZbWZfL9aJYw5b68Qx5zLL5bD/uBrUHQrOLRi88Hdpu+vxq2yOBB248OsIubd33hfjlydm5JnwZTwxxWG3dtfdcCvbsEjXjD9xSTxeaI1NxJY9GbgA1Ns7sK/+TmHkfFAXAGOmFJY+9u2F26Udntt68vmmfSBvhfHyqFFK3kl9N7THrc8zs+eM2LvAtUcWVXj+ytu5D7w6PYU8PjA0Dsrzsj/bKGRnuZf6srXW1Kv4F1WPKiyiPk2dHuovZ+JbNN4pzNsG/FS1oEIjw7U19nZfqyBDTbzY+ISY+g/M9vuvkksqYT5XlUdsKCbJQlxrUXC28ugCc17FtbVBvzMGvo8s/PrszfnavRcQ94RUXeSz2nmFbNBvIxD109v65k4UH1LBtdiDawp53W9juxH5vnYr27Aorhm7BLYTogLw4LZS8pEVy+93y9pBqPjieXP9qoW6ir0C0iXQTPDlais4h6gjFvaxqAKmqeoNejy7arHE42uxaRDUckSlESl+ulZqAiU3FHKFmD2ilJxZcHr4n2r6n2OOObz5D2SjvPq1tcPWAAAAAElFTkSuQmCC'
																	/>
																</IonCol>
															) : ex.status === "accepted" ? (
																<IonCol class='ion-text-center'>
																	<img
																		alt='accept'
																		src='https://img.icons8.com/color/48/000000/checked--v4.png'
																	/>
																</IonCol>
															) : (
																<IonCol class='ion-text-center'>
																	<img
																		alt='reject'
																		src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAE+ElEQVRoge2ZTWxUVRTHf2fevDdTygBVHLZgDLiqLdCStKNMEJvospBUKo2LbqCQICohxrDCEKMoIcbKookffFgSYGmjEVM0EVrEoisgRnSFUIXSVmDem3nXxbRA570372OGxkV/q8m9Z+45/9yPc+59MMccc5RDqjnYRFtLmnx+LUJDDJYrSCPUAmAzKcKoDVdARjDMM6mBkdFq+a5YyFgmU6clzc2i6AJWhxhTIQwrJYfzhdzRusGLY5XEEVnIWCZTF0+au1H0AKlKggDGQX1sFaz3ogqKJGRy3ZouRO0H0lH+X4broN6Yf/r80bB/DCVktLU1VZOwDiF0hnUUCuHwnfy8nvTg4GTwvwRkoq0lLQVrAGRltOhCIlxQsfhLqW9+vBHMPABFEfnvgRUVBReey8qwng1yusX8DEZbW1PFmZh1EQArxNS/Um31tX6GvkJqkvneWVtO7qz+t5Do8zMqK2Ry3ZouUJurF1NU5OXJ9c1lDxjPPTKWydTFE+Ylqn/ERuW6VTCf9soznjMST5q7+f+IAFgS14xdXp2uQsYymToUW8N40Rqb0Ns7Atvr7R1ojU1hXCCw7Va2YZFbX9w1qKS5GcWCoA60+kaSe9+HZA0kklhffl7WXt+wCWPra5DLcW/PmxR+Hg7qamFc0zuB3tIO1xmZKgADodU3ktx3oCgCMLp70De96ml/XwRAIkFy7360lc1B3QHiGptDyERbS5piFRuI2FPL74uYxujuQd/oPGT0jZ0PREyTSBBbuiyoOwTWjGdXLXbE4bC0rSwhShfr1HHMTw442o0tO2bMjL5hE8aWHQ47s68X69TxoO4ARLR4trTRuUeUPBNmVADrZD8AxtadM9qN7p7iD9N0zgRTIvrL7ycP6oETDzc4hEzd7ELjK6aECkQgSjnKJcfSUrAk0ugUxbgts1IqEQGAKEd+czu15kf34C+mYhFFHKnBt2iMRpmzoqrPHQ9wExL4VubGjDzhgl+eCch4aYNDiMD1qKP7iZimYjFKHLdGh5Diu1N4vESYfb3ueaYCMUrkcmmbSx7hYth1XE7Ewxvb62j2q80cCL+UNjn3SMIaBAKnEr29w13EoYMzRFgn+zEPHXTYGd09oapmwFb5/JnSRoeQ1MDIKELgctT+7Qrq7t0ZbWZfL9aJYw5b68Qx5zLL5bD/uBrUHQrOLRi88Hdpu+vxq2yOBB248OsIubd33hfjlydm5JnwZTwxxWG3dtfdcCvbsEjXjD9xSTxeaI1NxJY9GbgA1Ns7sK/+TmHkfFAXAGOmFJY+9u2F26Udntt68vmmfSBvhfHyqFFK3kl9N7THrc8zs+eM2LvAtUcWVXj+ytu5D7w6PYU8PjA0Dsrzsj/bKGRnuZf6srXW1Kv4F1WPKiyiPk2dHuovZ+JbNN4pzNsG/FS1oEIjw7U19nZfqyBDTbzY+ISY+g/M9vuvkksqYT5XlUdsKCbJQlxrUXC28ugCc17FtbVBvzMGvo8s/PrszfnavRcQ94RUXeSz2nmFbNBvIxD109v65k4UH1LBtdiDawp53W9juxH5vnYr27Aorhm7BLYTogLw4LZS8pEVy+93y9pBqPjieXP9qoW6ir0C0iXQTPDlais4h6gjFvaxqAKmqeoNejy7arHE42uxaRDUckSlESl+ulZqAiU3FHKFmD2ilJxZcHr4n2r6n2OOObz5D2SjvPq1tcPWAAAAAElFTkSuQmCC'
																	/>
																</IonCol>
															)}
															<IonAlert
																isOpen={showAlert}
																onDidDismiss={() => setShowAlert(false)}
																cssClass='my-custom-class'
																message={`Status will be changed to <strong>${status.toUpperCase()}..!!</strong>`}
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
																			dispatch(
																				updateExpense(
																					expense,
																					status,
																					statusId,
																					driver,
																				),
																			);
																			window.location.reload();
																		},
																	},
																]}
															/>
															<IonCol size='4'></IonCol>
														</IonRow> */}

														<IonRow>
															<IonCol size='3'></IonCol>
															<IonCol class='ion-text-center'>
																{" "}
																<IonIcon
																	id='close'
																	onClick={() => {
																		setShowModal(true);
																		setExpenseImage(ex.expenseReceiptImage);
																	}}
																	icon={eye}
																/>
															</IonCol>
															<IonCol class='ion-text-center'>
																{ex.status === "pending" ? (
																	<div>
																		<img
																			alt='accept'
																			style={{
																				height: "20px",
																				width: "20px",
																			}}
																			onClick={() => {
																				setStatus("accepted");
																				setExpense(ex);

																				setStatusId(ex._id);
																				setShowAlert(true);
																			}}
																			src='https://img.icons8.com/color/48/000000/checked--v4.png'
																		/>
																		<img
																			alt='reject'
																			style={{
																				height: "20px",
																				width: "20px",
																			}}
																			onClick={() => {
																				setStatus("rejected");
																				setStatusId(ex._id);

																				setExpense(ex);
																				setShowAlert(true);
																			}}
																			src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAE+ElEQVRoge2ZTWxUVRTHf2fevDdTygBVHLZgDLiqLdCStKNMEJvospBUKo2LbqCQICohxrDCEKMoIcbKookffFgSYGmjEVM0EVrEoisgRnSFUIXSVmDem3nXxbRA570372OGxkV/q8m9Z+45/9yPc+59MMccc5RDqjnYRFtLmnx+LUJDDJYrSCPUAmAzKcKoDVdARjDMM6mBkdFq+a5YyFgmU6clzc2i6AJWhxhTIQwrJYfzhdzRusGLY5XEEVnIWCZTF0+au1H0AKlKggDGQX1sFaz3ogqKJGRy3ZouRO0H0lH+X4broN6Yf/r80bB/DCVktLU1VZOwDiF0hnUUCuHwnfy8nvTg4GTwvwRkoq0lLQVrAGRltOhCIlxQsfhLqW9+vBHMPABFEfnvgRUVBReey8qwng1yusX8DEZbW1PFmZh1EQArxNS/Um31tX6GvkJqkvneWVtO7qz+t5Do8zMqK2Ry3ZouUJurF1NU5OXJ9c1lDxjPPTKWydTFE+Ylqn/ERuW6VTCf9soznjMST5q7+f+IAFgS14xdXp2uQsYymToUW8N40Rqb0Ns7Atvr7R1ojU1hXCCw7Va2YZFbX9w1qKS5GcWCoA60+kaSe9+HZA0kklhffl7WXt+wCWPra5DLcW/PmxR+Hg7qamFc0zuB3tIO1xmZKgADodU3ktx3oCgCMLp70De96ml/XwRAIkFy7360lc1B3QHiGptDyERbS5piFRuI2FPL74uYxujuQd/oPGT0jZ0PREyTSBBbuiyoOwTWjGdXLXbE4bC0rSwhShfr1HHMTw442o0tO2bMjL5hE8aWHQ47s68X69TxoO4ARLR4trTRuUeUPBNmVADrZD8AxtadM9qN7p7iD9N0zgRTIvrL7ycP6oETDzc4hEzd7ELjK6aECkQgSjnKJcfSUrAk0ugUxbgts1IqEQGAKEd+czu15kf34C+mYhFFHKnBt2iMRpmzoqrPHQ9wExL4VubGjDzhgl+eCch4aYNDiMD1qKP7iZimYjFKHLdGh5Diu1N4vESYfb3ueaYCMUrkcmmbSx7hYth1XE7Ewxvb62j2q80cCL+UNjn3SMIaBAKnEr29w13EoYMzRFgn+zEPHXTYGd09oapmwFb5/JnSRoeQ1MDIKELgctT+7Qrq7t0ZbWZfL9aJYw5b68Qx5zLL5bD/uBrUHQrOLRi88Hdpu+vxq2yOBB248OsIubd33hfjlydm5JnwZTwxxWG3dtfdcCvbsEjXjD9xSTxeaI1NxJY9GbgA1Ns7sK/+TmHkfFAXAGOmFJY+9u2F26Udntt68vmmfSBvhfHyqFFK3kl9N7THrc8zs+eM2LvAtUcWVXj+ytu5D7w6PYU8PjA0Dsrzsj/bKGRnuZf6srXW1Kv4F1WPKiyiPk2dHuovZ+JbNN4pzNsG/FS1oEIjw7U19nZfqyBDTbzY+ISY+g/M9vuvkksqYT5XlUdsKCbJQlxrUXC28ugCc17FtbVBvzMGvo8s/PrszfnavRcQ94RUXeSz2nmFbNBvIxD109v65k4UH1LBtdiDawp53W9juxH5vnYr27Aorhm7BLYTogLw4LZS8pEVy+93y9pBqPjieXP9qoW6ir0C0iXQTPDlais4h6gjFvaxqAKmqeoNejy7arHE42uxaRDUckSlESl+ulZqAiU3FHKFmD2ilJxZcHr4n2r6n2OOObz5D2SjvPq1tcPWAAAAAElFTkSuQmCC'
																		/>
																	</div>
																) : ex.status === "accepted" ? (
																	<div>
																		<img
																			style={{
																				height: "20px",
																				width: "20px",
																			}}
																			alt='accept'
																			src='https://img.icons8.com/color/48/000000/checked--v4.png'
																		/>
																	</div>
																) : (
																	<div>
																		<img
																			style={{
																				height: "20px",
																				width: "20px",
																			}}
																			alt='reject'
																			src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAE+ElEQVRoge2ZTWxUVRTHf2fevDdTygBVHLZgDLiqLdCStKNMEJvospBUKo2LbqCQICohxrDCEKMoIcbKookffFgSYGmjEVM0EVrEoisgRnSFUIXSVmDem3nXxbRA570372OGxkV/q8m9Z+45/9yPc+59MMccc5RDqjnYRFtLmnx+LUJDDJYrSCPUAmAzKcKoDVdARjDMM6mBkdFq+a5YyFgmU6clzc2i6AJWhxhTIQwrJYfzhdzRusGLY5XEEVnIWCZTF0+au1H0AKlKggDGQX1sFaz3ogqKJGRy3ZouRO0H0lH+X4broN6Yf/r80bB/DCVktLU1VZOwDiF0hnUUCuHwnfy8nvTg4GTwvwRkoq0lLQVrAGRltOhCIlxQsfhLqW9+vBHMPABFEfnvgRUVBReey8qwng1yusX8DEZbW1PFmZh1EQArxNS/Um31tX6GvkJqkvneWVtO7qz+t5Do8zMqK2Ry3ZouUJurF1NU5OXJ9c1lDxjPPTKWydTFE+Ylqn/ERuW6VTCf9soznjMST5q7+f+IAFgS14xdXp2uQsYymToUW8N40Rqb0Ns7Atvr7R1ojU1hXCCw7Va2YZFbX9w1qKS5GcWCoA60+kaSe9+HZA0kklhffl7WXt+wCWPra5DLcW/PmxR+Hg7qamFc0zuB3tIO1xmZKgADodU3ktx3oCgCMLp70De96ml/XwRAIkFy7360lc1B3QHiGptDyERbS5piFRuI2FPL74uYxujuQd/oPGT0jZ0PREyTSBBbuiyoOwTWjGdXLXbE4bC0rSwhShfr1HHMTw442o0tO2bMjL5hE8aWHQ47s68X69TxoO4ARLR4trTRuUeUPBNmVADrZD8AxtadM9qN7p7iD9N0zgRTIvrL7ycP6oETDzc4hEzd7ELjK6aECkQgSjnKJcfSUrAk0ugUxbgts1IqEQGAKEd+czu15kf34C+mYhFFHKnBt2iMRpmzoqrPHQ9wExL4VubGjDzhgl+eCch4aYNDiMD1qKP7iZimYjFKHLdGh5Diu1N4vESYfb3ueaYCMUrkcmmbSx7hYth1XE7Ewxvb62j2q80cCL+UNjn3SMIaBAKnEr29w13EoYMzRFgn+zEPHXTYGd09oapmwFb5/JnSRoeQ1MDIKELgctT+7Qrq7t0ZbWZfL9aJYw5b68Qx5zLL5bD/uBrUHQrOLRi88Hdpu+vxq2yOBB248OsIubd33hfjlydm5JnwZTwxxWG3dtfdcCvbsEjXjD9xSTxeaI1NxJY9GbgA1Ns7sK/+TmHkfFAXAGOmFJY+9u2F26Udntt68vmmfSBvhfHyqFFK3kl9N7THrc8zs+eM2LvAtUcWVXj+ytu5D7w6PYU8PjA0Dsrzsj/bKGRnuZf6srXW1Kv4F1WPKiyiPk2dHuovZ+JbNN4pzNsG/FS1oEIjw7U19nZfqyBDTbzY+ISY+g/M9vuvkksqYT5XlUdsKCbJQlxrUXC28ugCc17FtbVBvzMGvo8s/PrszfnavRcQ94RUXeSz2nmFbNBvIxD109v65k4UH1LBtdiDawp53W9juxH5vnYr27Aorhm7BLYTogLw4LZS8pEVy+93y9pBqPjieXP9qoW6ir0C0iXQTPDlais4h6gjFvaxqAKmqeoNejy7arHE42uxaRDUckSlESl+ulZqAiU3FHKFmD2ilJxZcHr4n2r6n2OOObz5D2SjvPq1tcPWAAAAAElFTkSuQmCC'
																		/>
																	</div>
																)}
																<IonAlert
																	isOpen={showAlert}
																	onDidDismiss={() => setShowAlert(false)}
																	cssClass='my-custom-class'
																	message={`Status will be changed to <strong>${status.toUpperCase()}..!!</strong>`}
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
																				updateExpenseStatus(
																					expense,
																					status,
																					statusId,
																				);
																				// dispatch(
																				// 	updateExpense(
																				// 		expense,
																				// 		status,
																				// 		statusId,
																				// 		driver,
																				// 	),
																				// );
																				// window.location.reload();
																			},
																		},
																	]}
																/>
															</IonCol>
															<IonCol size='3'></IonCol>
														</IonRow>

														<IonModal isOpen={showModal} id={`${ex._id}`}>
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
																						setShowModal(false);
																					}}
																				/>
																			</IonCol>
																		</IonRow>
																	</IonToolbar>
																</IonRow>

																<IonRow>
																	<IonCol>
																		<IonLabel>Receipts</IonLabel>
																		<img
																			// src={expense.expenseReceiptImage}
																			src={expenseImage}
																			alt=''
																		/>
																	</IonCol>
																</IonRow>
															</IonContent>
														</IonModal>
													</IonCol>
												</IonRow>
												<div className='hr'></div>
											</div>
										);
									})}
								</IonGrid>
							</IonList>
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
										Car Maintenance are not added by any driver
									</IonLabel>
								</IonCol>
							</IonRow>
						</>
					)}
				</IonCard>
			</>
		</IonContent>
	);
};

export default ExpenseList;
