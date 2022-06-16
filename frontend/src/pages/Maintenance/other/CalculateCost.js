import { IonLabel } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";

const CalculateCost = ({ SGST, CGST, basicAmount, calculatedAmount }) => {
	const [totalAmount, setTotalAmount] = useState(0);

	useEffect(() => {
		if (CGST === 0 && SGST > 0) {
			let costWithSGST = (Number(SGST) / 100) * Number(basicAmount);
			setTotalAmount(Number(costWithSGST) + Number(basicAmount));
		} else if (CGST > 0 && SGST === 0) {
			let costWithGST = (Number(CGST) / 100) * Number(basicAmount);

			setTotalAmount(Number(costWithGST) + Number(basicAmount));
		} else if (CGST > 0 && SGST > 0) {
			let costWithGST = (Number(CGST) / 100) * Number(basicAmount);
			let costWithSGST = (Number(SGST) / 100) * Number(basicAmount);
			setTotalAmount(
				Number(basicAmount) + Number(costWithGST) + Number(costWithSGST),
			);
		} else {
			setTotalAmount(Number(basicAmount));
		}
		calculatedAmount(totalAmount.toFixed(2));
	}, [SGST, CGST, basicAmount, calculatedAmount, totalAmount]);

	return (
		<>
			<IonLabel class='spx-font-color-black'>Total Amount : </IonLabel>
			<IonLabel class='spx-font-color-black theme spx-font-18'>
				<FaRupeeSign size={14} />
				{totalAmount.toFixed(2)}
			</IonLabel>{" "}
		</>
	);
};

export default CalculateCost;
