/*
 *  DatabaseConnect.js - Teacher's Pet - CS 476 Project
 *  Purpose: Defines the database connection
 * 
 *  Author: David Lee
 */
  if (!firebase.apps.length){
      var Config = {
        apiKey: "AIzaSyAogIasY-OkdiDRsC3JloErogCXS18UmfI",
        authDomain: "teacher-spet.firebaseapp.com",
        databaseURL: "https://teacher-spet-default-rtdb.firebaseio.com/",
        projectId: "teacher-spet",
        storageBucket: "teacher-spet.appspot.com",
        messagingSenderId: "38397828218",
        appId: "1:38397828218:web:c7801adab7ea53c9e8afc3",
        measurementId: "G-0X4QR33H6G"
      }
      firebase.initializeApp(Config); //initialize firebase with the config
      console.log("Firebase Connection Initialized");
  }
  
  export const fb = firebase; //export the variable to access firebase
  
  export const db = firebase.firestore(); //export the variable to access the firestore database
  
  export const auth = firebase.auth(); //export the authentication portion of firebase
  
  export const storage = firebase.storage().ref();

  db.settings({ timestampsInSnapshots: true});
