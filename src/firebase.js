import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA-LHeBuHUYG9vbChr9v2FelH46-71T6J8",
  authDomain: "instagram-clone-764c7.firebaseapp.com",
  databaseURL: "https://instagram-clone-764c7.firebaseio.com",
  projectId: "instagram-clone-764c7",
  storageBucket: "instagram-clone-764c7.appspot.com",
  messagingSenderId: "131150049837",
  appId: "1:131150049837:web:649ebc169d80ec15e63ea4",
  measurementId: "G-7DSK3T7PXT"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage }