import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCocYjQryPIRjDuONsRbzgcFOexWgR-KE4",
  authDomain: "lucknow-food-delivery-app.firebaseapp.com",
  projectId: "lucknow-food-delivery-app",
  storageBucket: "lucknow-food-delivery-app.appspot.com",
  messagingSenderId: "269855650821",
  appId: "1:269855650821:web:24498c42c06123762cd86c",
  measurementId: "G-6X56WV368J"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export function getRestaurantId(){
  return localStorage.getItem("restaurantId");
}