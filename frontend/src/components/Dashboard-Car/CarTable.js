import React, { useEffect, useState } from "react";

import { getCarList } from "../../actions/carActions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import {
	IonButton,
	IonCard,
	IonCol,
	IonContent,
	IonGrid,
	IonIcon,
	IonLabel,
	IonRow,
} from "@ionic/react";
import "./CarTable.css";
import { Link } from "react-router-dom";
import { addCircleOutline, addCircleSharp } from "ionicons/icons";
import WrapContent from "../WrapContent";

const CarTable = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { keyword, pageNumbers } = useParams();
	const [path, setPath] = useState(location.pathname);

	const carList = useSelector((state) => state.carList);
	const {
		loading: carListLoading,
		error: carListError,
		cars,
		page,
		pages,
	} = carList;

	useEffect(() => {
		dispatch(getCarList());
	}, [dispatch]);

	return (
		<>
			{cars.length !== 0 && (
				<IonCard class='blue-border'>
					<IonGrid no-padding>
						<IonRow class=' ml-20 mr-20'>
							<IonCol className='ion-align-self-center'>
								<IonLabel className='spx-font-16 spx-font-color-black spx-bold'>
									Cars & Document{" "}
								</IonLabel>{" "}
							</IonCol>
							<IonCol>
								<Link to='/admin/add/Car'>
									<IonButton className='ion-float-right '>
										Add Car{" "}
										<IonIcon
											slot='end'
											ios={addCircleSharp}
											md={addCircleSharp}
										/>
									</IonButton>
								</Link>
							</IonCol>
						</IonRow>
						<div className='table-header  ml-20 mr-20'>
							<div className='hr'></div>
							<IonRow className='spx-bold spx-color-white '>
								<IonCol className='spx-bold '>Car</IonCol>
								<IonCol className='spx-bold '>PUC No.</IonCol>
								<IonCol className='spx-bold '>RC No.</IonCol>
								<IonCol className='spx-bold '>Status</IonCol>
							</IonRow>
							<div className='hr'></div>
						</div>
						{cars.map((car, i) => {
							if (i < 4) {
								return (
									<div className='ml-20 mr-20'>
										<IonRow
											className='ion-align-self-center table spx-font-color-black'
											key={car._id}>
											<IonCol>
												{/* <IonLabel>{car.carName}</IonLabel> */}
												<WrapContent>
													<IonLabel>{car.carName}</IonLabel>
												</WrapContent>
											</IonCol>
											<IonCol>
												<WrapContent>
													<IonLabel>{car.PUCNumber}</IonLabel>
												</WrapContent>
											</IonCol>
											<IonCol>
												<WrapContent>
													<IonLabel>{car.RCNumber}</IonLabel>
												</WrapContent>
											</IonCol>
											{car.carStatus === true ? (
												<IonCol style={{ color: "green" }}> Assigned </IonCol>
											) : (
												<IonCol style={{ color: "red" }}>Not Assigned</IonCol>
											)}
										</IonRow>
										<div className='hr'></div>
									</div>
								);
							}
						})}
						<IonRow className='ion-align-self-center ion-text-center'>
							<IonCol></IonCol>
							<IonCol></IonCol>
							<IonCol></IonCol>

							<IonCol>
								<Link to='/admin/CarsList'>
									<IonLabel>View All</IonLabel>
								</Link>
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonCard>
			)}
		</>
	);
};

export default CarTable;
