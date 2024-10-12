// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD-1-nhjXr1Ai_MmaIW53kSjwSz2_Arl1w',
  authDomain: 'mini-social-media-application.firebaseapp.com',
  projectId: 'mini-social-media-application',
  storageBucket: 'mini-social-media-application.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'project-516484384705',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
