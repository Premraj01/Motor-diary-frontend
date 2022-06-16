import React, { useEffect } from "react";
import {
	IonCard,
	IonCol,
	IonGrid,
	IonRow,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import "./Cards.css";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import { getCarList } from "../../actions/carActions";
import { getDriversList } from "../../actions/driverActions";
import { getJourneyList } from "../../actions/journeyActions";

const Cards = () => {
	const dispatch = useDispatch();
	const driversList = useSelector((state) => state.driversList);
	const { drivers } = driversList;
	const carList = useSelector((state) => state.carList);
	const { loading: carListLoading, error: carListError, cars } = carList;
	const journeyList = useSelector((state) => state.journeyList);
	const { pendingJourneyCount } = journeyList;

	useEffect(() => {
		dispatch(getCarList());
		dispatch(getJourneyList());
		dispatch(getDriversList());
	}, [dispatch]);

	return (
		<IonGrid id='cards'>
			<IonRow>
				<IonCol class='ion-text-center '>
					<IonCard className='cards' routerLink='/admin/DriversList'>
						<>
							<IonTitle id='card-label' className='ion-padding'>
								Drivers
							</IonTitle>

							<IonTitle id='card-count' className='ion-padding'>
								<CountUp end={drivers.length} duration={1} />
							</IonTitle>
						</>
					</IonCard>
				</IonCol>
				<IonCol class='ion-text-center'>
					<IonCard className='cards' routerLink='/admin/CarsList'>
						<>
							<IonTitle id='card-label' className='ion-padding'>
								Cars
							</IonTitle>
							<IonTitle id='card-count' className='ion-padding'>
								<CountUp end={cars.length} duration={1} />
							</IonTitle>
						</>
					</IonCard>
				</IonCol>
				<IonCol class='ion-text-center'>
					<IonCard className='cards'>
						<>
							<IonTitle id='card-label' className='ion-padding'>
								Pending Trips
							</IonTitle>
							<IonTitle id='card-count' className='ion-padding'>
								<CountUp end={pendingJourneyCount} duration={1} />
							</IonTitle>
						</>
					</IonCard>
				</IonCol>
			</IonRow>
		</IonGrid>
	);
};

export default Cards;
