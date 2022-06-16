import { IonButton } from "@ionic/react";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { displayDateFormate } from "../Services/DateFormat";

const DownloadCsv = ({ data, fileName }) => {
	const [downloadExpenses, setDownloadExpenses] = useState([]);

	useEffect(() => {
		data.map((ex) => {
			setDownloadExpenses([
				...downloadExpenses,
				{
					date: displayDateFormate(ex.date),
					driver: ex.driver.firstName + " " + ex.driver.lastName,
					expense_type: ex.expenseType,
					amount: ex.expenseAmount,
				},
			]);
		});
	}, []);
	return (
		<IonButton variant='warning'>
			<CSVLink data={downloadExpenses} filename={fileName}>
				Export
			</CSVLink>
		</IonButton>
	);
};

export default DownloadCsv;
