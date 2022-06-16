import {
	IonBadge,
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonHeader,
	IonIcon,
	IonLabel,
	IonList,
	IonMenuButton,
	IonPage,
	IonPopover,
	IonRow,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDriversList } from "../actions/driverActions";
import CarTable from "../components/Dashboard-Car/CarTable";
import Cards from "../components/Dashboard-Cards/Cards";
import DriversTable from "../components/Dashboard-Driver/DriversTable";
import Journey from "../components/Journey/Journey";
import "./Dashboard.css";
import { notifications } from "ionicons/icons";

const Page = () => {
	const dispatch = useDispatch();

	const [driver, setDriver] = useState([]);
	const [notification, setNotification] = useState(false);

	let driverArr = [];
	const driversList = useSelector((state) => state.driversList);
	const { error, drivers } = driversList;

	// window.location.reload();

	useEffect(() => {
		drivers.map((d) => {
			if (d.monthlyTripReading > 1150) {
				driverArr.push(d);
				setDriver([...driverArr]);
				setNotification(true);
			}
		});
		dispatch(() => getDriversList());
	}, [dispatch, drivers]);

	return (
		<IonPage className='dashboard'>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle class='spx-bold spx-font-color-black'>Dashboard </IonTitle>
					<IonTitle slot='end' class='ion-margin-end'>
						<IonToolbar>
							<IonButtons slot='end'>
								<IonButton id='show-popover' disabled={driver.length === 0}>
									<IonIcon icon={notifications} class='spx-font-24'></IonIcon>
									{notification && (
										<IonBadge color='danger' class='notification-badge'>
											{driver.length}
										</IonBadge>
									)}
								</IonButton>
							</IonButtons>
						</IonToolbar>
					</IonTitle>
				</IonToolbar>
				<IonPopover trigger='show-popover' backdropDismiss={true}>
					{driver.map((d) => {
						return (
							<>
								<IonList class=' ion-padding-start'>
									<IonLabel class='spx-font-14 '>
										<span className='spx-font-14 spx-bold'>
											{d.firstName} {d.lastName}
										</span>{" "}
										has completed{" "}
										<span className='spx-font-14 spx-bold'>
											{d.monthlyTripReading} Km
										</span>{" "}
										for this month.
									</IonLabel>
								</IonList>
								<div className='hr'></div>
							</>
						);
					})}
				</IonPopover>
			</IonHeader>

			<IonContent fullscreen class='grey'>
				<Cards />
				<Journey />
				<IonRow>
					<IonCol>
						<DriversTable />
					</IonCol>
					<IonCol>
						<CarTable />{" "}
					</IonCol>
				</IonRow>
			</IonContent>
		</IonPage>
	);
};

export default Page;
