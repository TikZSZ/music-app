import { initializeApp } from "firebase/app";

// dev
// import {config} from "env"
// const firebaseConfig = config
//prod
console.log ( process.env,
  process.env.AUTH_DOMAIN,
  process.env.PROJECT_ID,
  process.env.STORAGE_BUCKET,
  process.env.MESSAGING_SENDER_ID,
  process.env.APP_ID,
  process.env.MEASUREMENT_ID
)

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
}


// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

