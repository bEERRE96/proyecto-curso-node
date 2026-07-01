import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FB_apiKey,
  authDomain: process.env.FB_authDomain,
  projectId: process.env.FB_projectId,
  storageBucket: process.env.FB_storageBucket,
  messagingSenderId: process.env.FB_messagingSenderId,
  appId: process.env.FB_appId,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db, app };
