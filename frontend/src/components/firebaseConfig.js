import firebase from "firebase/compat/app";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDEGAeqq6KdppuZDeOCMxrt0y5jn5eaJ0",
  authDomain: "music-object.firebaseapp.com",
  projectId: "music-object",
  storageBucket: "music-object.appspot.com",
  messagingSenderId: "94106555606",
  appId: "1:94106555606:web:6acabdd202a827cf352577",
  measurementId: "G-B6T93HN2K9"
};

  firebase.initializeApp(firebaseConfig);


  // Log a message to indicate Firebase initialization

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = firebase.storage();
export { firebase,storage };
