const { initializeApp } = require ("firebase/app");
 const {getStorage, ref, uploadBytes, uploadString} = require( "firebase/storage");
//import firebase from '@firebase/app';
//import '@firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyCUbupendg-Oq3Op8snzxJEJlJ_0JYppe8",
    authDomain: "evaluation-5a045.firebaseapp.com",
    projectId: "evaluation-5a045",
    storageBucket: "evaluation-5a045.appspot.com",
    messagingSenderId: "714202249245",
    appId: "1:714202249245:web:ee02ede27e349c3bbdeef4",
    measurementId: "G-BLQVF7BHLX"
  };

 const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
module.exports = { storage,  uploadBytes, uploadString};