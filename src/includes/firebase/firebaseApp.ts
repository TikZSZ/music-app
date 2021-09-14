import { initializeApp } from "firebase/app";
import {config} from "../../../env"
let firebaseConfig = {};

if(process.env.VUE_APP_VERCEL_ENV === "production"){
  firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  }
}else{
  firebaseConfig = config
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

