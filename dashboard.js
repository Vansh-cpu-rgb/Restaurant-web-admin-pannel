import { db } from "./firebase.js";

import {
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadDashboard(){

let totalOrders = 0;
let totalRevenue = 0;
let totalProducts = 0;
let totalReviews = 0;

/* Orders */

const orderSnap =
await getDocs(
collection(db,"orders")
);

totalOrders = orderSnap.size;

orderSnap.forEach(doc=>{

const data = doc.data();

totalRevenue +=
Number(data.total || 0);

});

/* Products */

const productSnap =
await getDocs(
collection(db,"products")
);

totalProducts =
productSnap.size;

/* Reviews */

const reviewSnap =
await getDocs(
collection(db,"reviews")
);

totalReviews =
reviewSnap.size;

/* UI Update */

document.getElementById(
"totalOrders"
).innerText =
totalOrders;

document.getElementById(
"totalRevenue"
).innerText =
"₹" + totalRevenue;

document.getElementById(
"totalProducts"
).innerText =
totalProducts;

document.getElementById(
"totalReviews"
).innerText =
totalReviews;

}

loadDashboard();