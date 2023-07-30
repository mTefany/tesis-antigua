//importar firebase
import { initializeApp } from "firebase/app";
//importar usuario 
import {getAuth} from 'firebase/auth';

//datos de configuraion de firebase
const firebaseConfig = {
  apiKey: "AIzaSyAKy23WZonQ_dU9mtUAo9Of-mB3wse_4d8",
  authDomain: "monitoreo-humedad.firebaseapp.com",
  databaseURL: "https://monitoreo-humedad-default-rtdb.firebaseio.com",
  projectId: "monitoreo-humedad",
  storageBucket: "monitoreo-humedad.appspot.com",
  messagingSenderId: "1090458914878",
  appId: "1:1090458914878:web:37349fe759032e8341016f"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
// Inicializar Usuario
export const auth = getAuth(app);