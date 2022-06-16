import { useEffect, useState } from "react";
import {
	IonAlert,
	IonCard,
	IonCol,
	IonContent,
	IonGrid,
	IonLabel,
	IonList,
	IonLoading,
	IonRow,
	IonSearchbar,
} from "@ionic/react";
import "./Journey.css";
import { AiOutlineFileDone } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getJourneyList, updateJourney } from "../../actions/journeyActions";
import "jspdf-autotable";
import { displayDateFormate } from "../Services/DateFormat";

const Journey = () => {
	const dispatch = useDispatch();

	const { pageNumber } = useParams();
	const [showAlert, setShowAlert] = useState(false);
	const [status, setStatus] = useState("");
	const [statusId, setStatusId] = useState("");
	const [journey, setJourney] = useState("");
	const [keyword, setKeyword] = useState("");

	const journeyList = useSelector((state) => state.journeyList);
	const { loading, journeys, pendingJourneyCount } = journeyList;

	useEffect(() => {
		dispatch(getJourneyList(keyword));
	}, [dispatch, keyword, pageNumber]);

	return (
		<>
			{loading ? (
				<IonLoading isOpen={true} message={"Please wait..."}></IonLoading>
			) : (
				<>
					<IonCard class='blue-border '>
						<IonGrid no-padding>
							<IonRow class='ml-20 mr-20'>
								<IonCol size='3' className='ion-align-self-center '>
									<IonLabel className='spx-font-16 spx-bold spx-font-color-black'>
										Pending Approval Trip
									</IonLabel>
								</IonCol>
								<IonCol size='5'></IonCol>
								<IonCol size='4'>
									<IonSearchbar
										class='ion-float-right'
										placeholder='Search by Driver '
										value={keyword}
										debounce={1000}
										onIonChange={(e) => {
											setKeyword(e.target.value);
											// dispatch(getJourneyList(e.target.value));
										}}></IonSearchbar>
								</IonCol>
							</IonRow>

							{pendingJourneyCount !== 0 ? (
								<>
									<div className='table-header ml-20 mr-20'>
										<div className='hr'></div>
										<IonRow className='ion-align-self-center'>
											<IonCol size='2' className='spx-bold spx-color-white '>
												<IonLabel>Driver Name</IonLabel>
											</IonCol>

											<IonCol size='2' className='spx-bold spx-color-white '>
												<IonLabel>Date & Time</IonLabel>
											</IonCol>

											<IonCol size='2' className='spx-bold spx-color-white '>
												<IonLabel>Description Trip</IonLabel>
											</IonCol>

											<IonCol
												size='1'
												className='spx-bold ion-text-center spx-color-white '>
												<IonLabel>Start KM</IonLabel>
											</IonCol>
											<IonCol
												size='1'
												className='spx-bold ion-text-center spx-color-white '>
												<IonLabel>End KM</IonLabel>
											</IonCol>
											<IonCol
												size='2'
												className='spx-bold ion-text-center spx-color-white '>
												<IonLabel>Trip KM</IonLabel>
											</IonCol>

											<IonCol
												size='2'
												className='spx-bold ion-text-center spx-color-white '>
												<IonLabel>Action</IonLabel>
											</IonCol>
										</IonRow>

										<div className='hr ion-no-margin'></div>
									</div>
									<div className='ml-20 mr-20'>
										<IonList class='dairy-card ion-no-padding'>
											<IonGrid>
												{journeys
													.slice(0)
													.reverse()
													.map((j, i) => {
														if (j.journey.status === "pending") {
															return (
																<>
																	<IonRow
																		className='ion-align-self-center ion-no-margin  table spx-font-color-black '
																		key={j._id}>
																		<IonCol size='2'>
																			<IonLabel>
																				{j.driver.firstName} &nbsp;
																				{j.driver.lastName}
																			</IonLabel>
																		</IonCol>

																		<IonCol size='2'>
																			<IonLabel class='ion-float-left'>
																				{displayDateFormate(
																					j.journey.journeyDate,
																				)}{" "}
																				{j.journey.journeyTime}
																			</IonLabel>
																		</IonCol>

																		<IonCol size='2'>
																			<IonLabel>
																				{j.journey.startDestination}
																			</IonLabel>
																		</IonCol>

																		<IonCol size='1' class='ion-text-center'>
																			<IonLabel>
																				{j.journey.startReading}
																			</IonLabel>
																		</IonCol>
																		<IonCol size='1' class='ion-text-center'>
																			<IonLabel>
																				{j.journey.endReading}
																			</IonLabel>
																		</IonCol>
																		<IonCol size='2' class='ion-text-center'>
																			<IonLabel>
																				{j.journey.endReading -
																					j.journey.startReading}
																			</IonLabel>
																		</IonCol>

																		<IonCol size='2' id='action'>
																			{j.journey.status === "pending" && (
																				<IonRow>
																					<IonCol>
																						<img
																							alt='accept'
																							onClick={() => {
																								setStatus("accepted");
																								setJourney(j);
																								setStatusId(j._id);
																								setShowAlert(true);
																							}}
																							src='https://img.icons8.com/color/48/000000/checked--v4.png'
																						/>
																					</IonCol>
																					<IonCol>
																						<img
																							alt='reject'
																							onClick={() => {
																								setStatus("rejected");
																								setStatusId(j._id);
																								setJourney(j);
																								setShowAlert(true);
																							}}
																							src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAE+ElEQVRoge2ZTWxUVRTHf2fevDdTygBVHLZgDLiqLdCStKNMEJvospBUKo2LbqCQICohxrDCEKMoIcbKookffFgSYGmjEVM0EVrEoisgRnSFUIXSVmDem3nXxbRA570372OGxkV/q8m9Z+45/9yPc+59MMccc5RDqjnYRFtLmnx+LUJDDJYrSCPUAmAzKcKoDVdARjDMM6mBkdFq+a5YyFgmU6clzc2i6AJWhxhTIQwrJYfzhdzRusGLY5XEEVnIWCZTF0+au1H0AKlKggDGQX1sFaz3ogqKJGRy3ZouRO0H0lH+X4broN6Yf/r80bB/DCVktLU1VZOwDiF0hnUUCuHwnfy8nvTg4GTwvwRkoq0lLQVrAGRltOhCIlxQsfhLqW9+vBHMPABFEfnvgRUVBReey8qwng1yusX8DEZbW1PFmZh1EQArxNS/Um31tX6GvkJqkvneWVtO7qz+t5Do8zMqK2Ry3ZouUJurF1NU5OXJ9c1lDxjPPTKWydTFE+Ylqn/ERuW6VTCf9soznjMST5q7+f+IAFgS14xdXp2uQsYymToUW8N40Rqb0Ns7Atvr7R1ojU1hXCCw7Va2YZFbX9w1qKS5GcWCoA60+kaSe9+HZA0kklhffl7WXt+wCWPra5DLcW/PmxR+Hg7qamFc0zuB3tIO1xmZKgADodU3ktx3oCgCMLp70De96ml/XwRAIkFy7360lc1B3QHiGptDyERbS5piFRuI2FPL74uYxujuQd/oPGT0jZ0PREyTSBBbuiyoOwTWjGdXLXbE4bC0rSwhShfr1HHMTw442o0tO2bMjL5hE8aWHQ47s68X69TxoO4ARLR4trTRuUeUPBNmVADrZD8AxtadM9qN7p7iD9N0zgRTIvrL7ycP6oETDzc4hEzd7ELjK6aECkQgSjnKJcfSUrAk0ugUxbgts1IqEQGAKEd+czu15kf34C+mYhFFHKnBt2iMRpmzoqrPHQ9wExL4VubGjDzhgl+eCch4aYNDiMD1qKP7iZimYjFKHLdGh5Diu1N4vESYfb3ueaYCMUrkcmmbSx7hYth1XE7Ewxvb62j2q80cCL+UNjn3SMIaBAKnEr29w13EoYMzRFgn+zEPHXTYGd09oapmwFb5/JnSRoeQ1MDIKELgctT+7Qrq7t0ZbWZfL9aJYw5b68Qx5zLL5bD/uBrUHQrOLRi88Hdpu+vxq2yOBB248OsIubd33hfjlydm5JnwZTwxxWG3dtfdcCvbsEjXjD9xSTxeaI1NxJY9GbgA1Ns7sK/+TmHkfFAXAGOmFJY+9u2F26Udntt68vmmfSBvhfHyqFFK3kl9N7THrc8zs+eM2LvAtUcWVXj+ytu5D7w6PYU8PjA0Dsrzsj/bKGRnuZf6srXW1Kv4F1WPKiyiPk2dHuovZ+JbNN4pzNsG/FS1oEIjw7U19nZfqyBDTbzY+ISY+g/M9vuvkksqYT5XlUdsKCbJQlxrUXC28ugCc17FtbVBvzMGvo8s/PrszfnavRcQ94RUXeSz2nmFbNBvIxD109v65k4UH1LBtdiDawp53W9juxH5vnYr27Aorhm7BLYTogLw4LZS8pEVy+93y9pBqPjieXP9qoW6ir0C0iXQTPDlais4h6gjFvaxqAKmqeoNejy7arHE42uxaRDUckSlESl+ulZqAiU3FHKFmD2ilJxZcHr4n2r6n2OOObz5D2SjvPq1tcPWAAAAAElFTkSuQmCC'
																						/>
																					</IonCol>
																				</IonRow>
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
																								updateJourney(
																									journey,
																									status,
																									statusId,
																								),
																							);
																							// dispatch(updateReading(statusId));
																							window.location.reload();
																						},
																					},
																				]}
																			/>
																		</IonCol>
																	</IonRow>
																	<IonRow>
																		<IonCol>
																			<div className='hr'></div>
																		</IonCol>
																	</IonRow>
																</>
															);
														}
													})}
											</IonGrid>
										</IonList>
									</div>
								</>
							) : (
								<>
									<IonRow>
										<IonCol class='ion-text-center'>
											<IonRow>
												<IonCol class='ion-text-center'>
													<AiOutlineFileDone size={100} />
												</IonCol>
											</IonRow>
											<IonLabel class='spx-bold'>No Pending Journeys</IonLabel>
										</IonCol>
									</IonRow>
								</>
							)}
						</IonGrid>
					</IonCard>
				</>
			)}
		</>
	);
};

export default Journey;
