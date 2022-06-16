import {
  IonAlert,
  IonAvatar,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonRow,
} from '@ionic/react';

import {  Link, useLocation } from 'react-router-dom';
import { desktopSharp,peopleCircle,carSharp, speedometer, logOutSharp, cashSharp, cog, funnel } from 'ionicons/icons';
import './Menu.css';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/adminAction';
import logo from "../Utils/Images/logo.jpeg"

interface AppPage {
  url:  any;
  iosIcon: string;
  mdIcon: string;
  title: string;
}




// const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu = () => {
 const location = useLocation();
 const [showMenu,setShowMenu] = useState(false)
 const [showAlert,setShowAlert] = useState(false)
 
 const dispatch = useDispatch()
 const[loading,setLoading] = useState(localStorage.getItem("loading"))


useEffect(()=>{
    if(loading === "true"){
      localStorage.setItem("loading",JSON.stringify(false));
      setLoading(localStorage.getItem("loading"))
      window.location.reload()
    }
},[loading])


 
 
  return (
    <IonMenu contentId="main" class='ion-no-padding' type='overlay'  disabled={showMenu} >
      <IonContent class='ion-no-padding'>
    
        <IonRow>
          <IonCol class='ion-text-center'>
          <IonChip class='header'>
              <IonAvatar>
                <IonImg src={logo}  alt=''/>
              </IonAvatar>
              <IonLabel class='spx-bold spx-font-24'>Motor Diary</IonLabel>
            </IonChip>
          </IonCol>
        </IonRow>
        
        <IonList id="inbox-list"  class='ion-no-padding'>
          
            <IonMenuToggle class='ion-no-padding'  style={{	background: "#363740"}} autoHide={false}>
               
               <IonItem className={location.pathname === '/' ? 'selected' : ''}  routerLink={'/'} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" class='icon-size' ios={desktopSharp} md={desktopSharp} />
                  <IonLabel>Dashboard</IonLabel>
                </IonItem>
               <IonItem className={location.pathname === '/admin/DriversList' ? 'selected' : ''}  routerLink={'/admin/DriversList'} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" class='icon-size' ios={peopleCircle} md={peopleCircle} />
                  <IonLabel>Drivers</IonLabel>
                </IonItem>
               <IonItem className={location.pathname === '/admin/CarsList' ? 'selected' : ''}  routerLink={'/admin/CarsList'} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot='start' class='icon-size' ios={carSharp} md={carSharp} />
                  <IonLabel>Cars</IonLabel>
                </IonItem>
               <IonItem className={location.pathname === '/admin/ExpenseList' ? 'selected' : ''}  routerLink={'/admin/ExpenseList'} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot='start' class='icon-size' ios={cashSharp} md={cashSharp} />
                  <IonLabel>Expenses</IonLabel>
                </IonItem>
               <IonItem className={location.pathname === '/admin/odometer' ? 'selected' : ''}  routerLink={'/admin/odometer'} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot='start' class='icon-size' ios={funnel} md={funnel} />
                  <IonLabel>Fuel History</IonLabel>
                </IonItem>
               <IonItem className={location.pathname === '/admin/carMaintenance' ? 'selected' : ''}  routerLink={'/admin/carMaintenance'} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot='start' class='icon-size' ios={cog} md={cog} />
                  <IonLabel>Car Maintenance</IonLabel>
                </IonItem>
               <IonItem style={{cursor:"pointer"}} onClick={()=>setShowAlert(true)}  routerDirection='none' lines="none">
                  <IonIcon slot='start' class='icon-size' ios={logOutSharp} md={logOutSharp} />
                  <IonLabel >Logout</IonLabel>
                  <IonAlert isOpen={showAlert}  
                    header={"Confirm"}
                    onDidDismiss={()=>setShowAlert(false)}
                      message={'Please confirm you want to <strong>Logout..!</strong>'}
                      buttons={[
                        {
                          text: 'Cancel',
                          role: 'cancel',
                          cssClass: 'secondary',
                          id: 'cancel-button',
                          handler: blah => {
                          }
                        },
                        {
                          text: 'Okay',
                          id: 'confirm-button',
                          handler: () => {
                            dispatch(logout())
                          }
                        }
          ]}></IonAlert>
                </IonItem>
                
              </IonMenuToggle>
              
          </IonList>
       <IonGrid style={{marginTop:"14%"}}>
       <IonRow >
       <IonCol class='ion-text-center '>   
         
            <IonChip >
              <IonLabel class='spx-font-12 spx-color-white'>&copy; Agrawwaal Telecomm Services,Pune</IonLabel> 
            </IonChip>
         
         </IonCol>
         
       </IonRow>
    <IonRow>
      
      <IonCol class='ion-text-center '>
         <IonChip >
          
          <a href="mailto:kopssolutions@gmail.com" className='remove-decoration'>
             <IonLabel class='spx-font-10'>Developed by Work Bench  </IonLabel>
         </a>
        
          </IonChip>
         </IonCol>
      
    </IonRow>
       </IonGrid>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
