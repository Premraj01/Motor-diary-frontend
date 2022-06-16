import {
	IonButton,
	IonCol,
	IonContent,
	IonGrid,
	IonInput,
	IonLabel,
	IonRow,
} from "@ionic/react";
import { useEffect, useState } from "react";

const AddMaintenanceType = ({ maintenance }) => {
	const [basicAmount, setBasicAmount] = useState(0);

	const [type, setType] = useState("");

	const addMaintenance = () => {
		maintenance({
			type,
			basicAmount,
		});

		setType("");
		setBasicAmount(0);
	};

	const validateNumber = (e) => {
		// const pattern = /^[-+]?[0-9]+\.[0-9]+$/;
		// let inputChar = String.fromCharCode(e.charCode);
		// if (e.keyCode !== 8 && !pattern.test(inputChar)) {
		// 	e.preventDefault();
		// }
	};

	return (
		<IonContent>
			<IonGrid class='ion-padding ion-align-self-center'>
				<IonRow>
					<IonCol class=' ion-text-center'>
						<IonLabel class='spx-font-color-black'>Maintenance Type</IonLabel>
					</IonCol>
				</IonRow>
				<IonRow>
					<IonCol class='ion-text-center'>
						<IonInput
							onIonChange={(e) => setType(e.target.value)}
							placeholder='Maintenance Type'
							value={type}
							class='input-field'
							required
						/>
					</IonCol>
				</IonRow>
				<div className='hr'></div>
				<IonRow class='ion'>
					<IonCol class=' ion-text-center'>
						<IonLabel class='spx-font-color-black'>Basic Amount</IonLabel>
					</IonCol>
				</IonRow>
				<IonRow>
					<IonCol className='ion-align-self-center ion-text-center'>
						<>
							<IonInput
								onIonChange={(e) => {
									setBasicAmount(e.target.value);
								}}
								type='number'
								value={basicAmount}
								placeholder='Enter Basic Amount'
								class='input-field'
								// onKeyPress={validateNumber}
								// required
							/>
						</>
					</IonCol>
				</IonRow>

				<div className='hr'></div>

				<IonRow>
					<IonCol class='ion-text-center'>
						<IonButton onClick={addMaintenance} disabled={!type}>
							Add Maintenance
						</IonButton>
					</IonCol>
				</IonRow>
			</IonGrid>
		</IonContent>
	);
};

export default AddMaintenanceType;
