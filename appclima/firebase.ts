import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
// ⬆️  TS dirá que falta el type; en runtime SÍ existe
//    (ponemos un ts-ignore y listo)
/* @ts-ignore-next-line */
import { getReactNativePersistence } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBG-S1g04pQIAI9HZApbQO5jA1qYZ8Ygt8",
  authDomain: "appclima-60a66.firebaseapp.com",
  projectId: "appclima-60a66",
  storageBucket: "appclima-60a66.firebasestorage.app",
  messagingSenderId: "474057182282",
  appId: "1:474057182282:web:d6ea27882e0e3d72046ab3"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firebaseAuth = getAuth(app); // por si lo necesitas en otro lado