import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: 'AIzaSyDk4Zm5GJ7YYYfGXAFG5YIzHdlDCEvCsBI',
  authDomain: 'realtime-chat-app-703e9.firebaseapp.com',
  projectId: 'realtime-chat-app-703e9',
  storageBucket: 'realtime-chat-app-703e9.appspot.com',
  messagingSenderId: '939672599337',
  appId: '1:939672599337:web:f72e6b47dde167f2b49538',
  measurementId: 'G-4T3Q2RE3EQ',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const storage = getStorage()
export const db = getFirestore()
