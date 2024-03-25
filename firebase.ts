import exp from 'constants';
import { getApp,getApps, initializeApp } from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCzmWdyZ8i-2t0h6P38f-9vsC00bw7JHeM",

  authDomain: "kepler-27ef1.firebaseapp.com",

  projectId: "kepler-27ef1",

  storageBucket: "kepler-27ef1.appspot.com",

  messagingSenderId: "583440469898",

  appId: "1:583440469898:web:b536d5a6314cfae5710273"


};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {app, db, auth};