
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBzB3twSVNttGgGQ9yhMQb0HPo5ywMMpI8",
    authDomain: "watchrasta.firebaseapp.com",
    projectId: "watchrasta",
    storageBucket: "watchrasta.appspot.com",
    messagingSenderId: "839347362900",
    appId: "1:839347362900:web:ec8b6be6e0b58bae17e1c1",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
