import {
	IonCol,
	IonItem,
	IonLabel,
	IonRow,
	IonSelect,
	IonSelectOption,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCarDetails, updateCar } from "../../../actions/carActions";
import { updateDriver } from "../../../actions/driverActions";
import { IonButton } from "@ionic/react";

const AssignCar = ({ driver, car }) => {
	const dispatch = useDispatch();

	const [carId, setCarId] = useState("");
	const [previousCarId, setPreviousCarId] = useState("");

	const carList = useSelector((state) => state.carList);
	const { loading: carListLoading, error: carListError, cars } = carList;

	const carUpdate = useSelector((state) => state.carUpdate);
	const {
		loading: carUpdateLoading,
		error: carUpdateError,
		success: carUpdateSuccess,
	} = carUpdate;

	const carDetails = useSelector((state) => state.carDetails);
	const {
		loading: carDetailsLoading,
		error: carDetailsError,
		car: dischargeCarStatus,
	} = carDetails;

	useEffect(() => {
		cars.map((car) => {
			if (car.carStatus === true) {
				window.location.reload();
			}
		});
	}, []);

	const dischargeCar = async (e) => {
		if (driver.carId !== null) {
			setPreviousCarId(car._id);

			dispatch(getCarDetails(previousCarId));
		}

		dispatch(
			updateCar({
				_id: dischargeCarStatus._id,
				carName: dischargeCarStatus.carName,
				RCNumber: dischargeCarStatus.RCNumber,
				PUCNumber: dischargeCarStatus.PUCNumber,
				carNumber: dischargeCarStatus.carNumber,
				insuranceNumber: dischargeCarStatus.insuranceNumber,
				carStatus: false,
			}),
		);

		dispatch(
			updateDriver({
				_id: driver._id,
				firstName: driver.firstName,
				lastName: driver.lastName,
				mobileNumber: driver.mobileNumber,
				password: driver.password,
				gender: driver.gender,
				licence: driver.licence,
				image: driver.photo,
				licenceImage: driver.licenceImage,
				carAssignedDate: driver.carAssignedDate,
				designation: driver.designation,
				birthDate: driver.birthDate,
				carId: carId,
				status: driver.status,
			}),
		);
	};

	return (
		<form>
			<IonRow>
				<IonCol class='ion-align-self-center'>
					<>
						<IonLabel class='spx-font-18'>Assigned Car:</IonLabel>
						{driver?.carId ? (
							<span className='spx-font-18' style={{ color: "green" }}>
								{" "}
								{car.carName + "-" + car.carNumber}
							</span>
						) : (
							<span className='spx-font-18' style={{ color: "red" }}>
								{" "}
								No car Assigned{" "}
							</span>
						)}
					</>
				</IonCol>
				<IonCol>
					<IonRow>
						<IonCol>
							<IonSelect
								class='input-field spx-font-color-black ion-margin-start'
								placeholder='Choose Car'
								onIonChange={(e) => setCarId(e.target.value)}>
								{cars.map((c) => {
									if (c.carStatus === false) {
										return (
											<IonSelectOption value={c} key={c._id}>
												{c.carName + "-" + c.carNumber}
											</IonSelectOption>
										);
									} else {
										return (
											<IonLabel key={c._id}>
												All Cars are Already Assigned...!
											</IonLabel>
										);
									}
								})}
							</IonSelect>
						</IonCol>

						<IonCol>
							<IonButton
								type='submit'
								variant='primary'
								className='rounded'
								onClick={dischargeCar}
								disabled={!carId}>
								Update Car
							</IonButton>
						</IonCol>
					</IonRow>
				</IonCol>
			</IonRow>
		</form>
	);
};

export default AssignCar;
