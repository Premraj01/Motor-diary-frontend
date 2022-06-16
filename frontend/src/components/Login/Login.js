import {
	IonButton,
	IonCard,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
	IonCol,
	IonContent,
	IonGrid,
	IonImg,
	IonInput,
	IonItem,
	IonLabel,
	IonRow,
	IonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/adminAction";
import "./Login.css";
import logo from "../../Utils/Images/logo.jpeg";
import loginImg from "../../Utils/Images/loginImg.jpeg";
import { checkmarkCircle, closeCircle } from "ionicons/icons";

const Login = ({ history }) => {
	const dispatch = useDispatch();

	const [mobileNumber, setMobile] = useState("");
	const [password, setPassword] = useState("");

	const [message, setMessage] = useState("");
	const [showToast, setShowToast] = useState(false);
	const [success, setSuccess] = useState(false);

	const adminLogin = useSelector((state) => state.adminLogin);
	const { error, adminInfo } = adminLogin;

	useEffect(() => {
		// localStorage.setItem("loading", JSON.stringify(true));
		if (adminInfo) {
			history.push("/");
		} else if (error) {
			setShowToast(true);
			setSuccess(false);
			setMessage(error);
		}
	}, [adminInfo, error]);

	const validateNumber = (e) => {
		const pattern = /[0-9\+\-\ ]/;
		let inputChar = String.fromCharCode(e.charCode);
		if (e.keyCode !== 8 && !pattern.test(inputChar)) {
			e.preventDefault();
		}
	};

	const submitHandler = (e) => {
		console.log("first", mobileNumber, password);
		e.preventDefault();
		dispatch(login(mobileNumber, password));
	};
	return (
		<div class='container-fluid'>
			<IonToast
				isOpen={showToast}
				onDidDismiss={() => setShowToast(false)}
				message={success ? "Login Success..!!" : message}
				icon={success ? checkmarkCircle : closeCircle}
				position='left'
				color={success ? "success" : "danger"}
				buttons={[
					{
						text: "Close",
						role: "cancel",
						handler: () => {},
					},
				]}
			/>
			<div class='row no-gutter'>
				<div class='col-md-7 d-none d-md-flex bg-image'></div>

				<div class='col-md-5 bg-light'>
					<div class='login d-flex align-items-center py-5'>
						<div class='container'>
							<div class='row'>
								<div class='col-lg-10 col-xl-7 mx-auto'>
									<h3 class='display-4'>Motor Diary</h3>
									<p class='text-muted mb-4'>
										Please login here with Mobile no. and Password
									</p>
									<form onSubmit={submitHandler}>
										<div class='form-group mb-3'>
											<input
												id='inputEmail'
												type='text/number'
												onKeyPress={validateNumber}
												placeholder='Mobile Number'
												onChange={(e) => setMobile(e.target.value)}
												class='form-control rounded-pill border-0 shadow-sm px-4'
											/>
										</div>
										<div class='form-group mb-3'>
											<input
												id='inputPassword'
												type='password'
												placeholder='Password'
												onChange={(e) => setPassword(e.target.value)}
												class='form-control rounded-pill border-0 shadow-sm px-4 text-primary'
											/>
										</div>

										<button
											type='submit'
											class='btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm'>
											Sign in
										</button>
										<div class='text-center d-flex justify-content-between mt-4'>
											<p>
												For any issues please contact{" "}
												<a
													href='mailto:kopssolutions@gmail.com'
													class='font-italic text-muted'>
													<u>Support</u>
												</a>
											</p>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		// <IonContent>
		// 	<div className='login'>
		// 		<div className='login-form'>
		// 			<>
		// 				<IonToast
		// 					isOpen={showToast}
		// 					onDidDismiss={() => setShowToast(false)}
		// 					message={success ? "Login Success..!!" : message}
		// 					icon={success ? checkmarkCircle : closeCircle}
		// 					position='left'
		// 					color={success ? "success" : "danger"}
		// 					buttons={[
		// 						{
		// 							text: "Close",
		// 							role: "cancel",
		// 							handler: () => {},
		// 						},
		// 					]}
		// 				/>

		// 				<IonCard>
		// 					<form onSubmit={submitHandler}>
		// 						<IonCardHeader>
		// 							<IonRow>
		// 								<IonCol class='logo'>
		// 									<img src={logo} alt=''></img>
		// 								</IonCol>
		// 							</IonRow>
		// 							<IonRow>
		// 								<IonCol class='ion-text-center'>
		// 									<IonCardTitle class='spx-bold'>Motor Diary</IonCardTitle>
		// 								</IonCol>
		// 							</IonRow>
		// 							<IonRow>
		// 								<IonCol class='ion-text-center'>
		// 									<IonCardSubtitle class='spx-bold'>Login</IonCardSubtitle>
		// 								</IonCol>
		// 							</IonRow>
		// 						</IonCardHeader>
		// 						<div className='hr'></div>
		// 						<IonRow>
		// 							<IonCol>
		// 								<IonLabel class='ion-padding'> Mobile Number </IonLabel>
		// 								<IonItem class='ion-no-margin ion-text-center' lines='none'>
		// 									<IonInput
		// 										placeholder='Enter Mobile Number'
		// 										class='input-field p-3 ion-no-margin'
		// 										onKeyPress={validateNumber}
		// 										value={mobileNumber}
		// 										onIonChange={(e) =>
		// 											setMobile(e.target.value)
		// 										}></IonInput>
		// 								</IonItem>
		// 								<IonLabel class='ion-padding'> Password</IonLabel>
		// 								<IonItem
		// 									class='ion-no-margin  ion-text-center'
		// 									lines='none'>
		// 									<IonInput
		// 										type='password'
		// 										placeholder='Enter Password'
		// 										value={password}
		// 										class='input-field'
		// 										onIonChange={(e) =>
		// 											setPassword(e.target.value)
		// 										}></IonInput>
		// 								</IonItem>
		// 							</IonCol>
		// 						</IonRow>
		// 						<IonRow>
		// 							<IonCol class='ion-text-center ion-padding'>
		// 								<IonButton type='submit' expand='block'>
		// 									Login
		// 								</IonButton>
		// 							</IonCol>
		// 						</IonRow>
		// 					</form>
		// 				</IonCard>
		// 			</>
		// 		</div>
		// 	</div>
		// </IonContent>
	);
};

export default Login;
