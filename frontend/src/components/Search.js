import React, { useEffect, useState } from "react";
import { IonButton, IonCol, IonRow, IonSearchbar } from "@ionic/react";

const Search = ({ props, history }) => {
	const [keyword, setKeyword] = useState("");

	const submitHandler = (e) => {
		if (keyword.trim()) {
			if (props === "/") {
				history.push(`/search/${keyword}`);
			} else {
				history.push(`${props}/search/${keyword}`);
			}
		} else {
			history.push(`${props}`);
		}
	};

	return (
		<form onClick={submitHandler}>
			<IonRow>
				<IonCol>
					<IonSearchbar
						value={keyword}
						onIonChange={(e) => setKeyword(e.target.value)}
						animated></IonSearchbar>
				</IonCol>
				<IonCol className='ion-align-self-center'>
					<IonButton type='submit'>Search</IonButton>{" "}
				</IonCol>
			</IonRow>
		</form>
	);
};

export default Search;
