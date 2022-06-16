import { IonLabel } from "@ionic/react";
import React from "react";

const WrapContent = ({ children }) => {
	// console.log(children.props.children);
	return (
		<>
			{children?.props?.children?.length > 6 ? (
				<IonLabel>{children.props.children.slice(0, 6)}...</IonLabel>
			) : (
				<IonLabel>{children?.props?.children}</IonLabel>
			)}
		</>
	);
};

export default WrapContent;
