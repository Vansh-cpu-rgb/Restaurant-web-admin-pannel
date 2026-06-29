import { db } from "./firebase.js";

import {
collection,
query,
orderBy,
onSnapshot,
doc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const liveContainer =
document.getElementById("liveOrdersContainer");

const historyContainer =
document.getElementById("historyOrdersContainer");
const searchInput =
document.getElementById("orderSearch");

window.currentOrderId = null;
window.allOrders = [];
const totalOrdersEl =
document.getElementById("totalOrders");

const pendingOrdersEl =
document.getElementById("pendingOrders");

const deliveredOrdersEl =
document.getElementById("deliveredOrders");

const todayRevenueEl =
document.getElementById("todayRevenue");
// =====================
// LOAD ORDERS
// =====================
let firstLoad = true;
let latestOrderId = null;
const ordersQuery = query(
collection(db,"orders"),
orderBy("createdAt","desc")
);

onSnapshot(ordersQuery,(snapshot)=>{

window.allOrders = [];
let firstOrder = null;


liveContainer.innerHTML = "";
historyContainer.innerHTML = "";

let liveCount = 0;
let newOrders = 0;
let historyCount = 0;
let totalOrders = 0;
let pendingOrders = 0;
let deliveredOrders = 0;
let revenue = 0;

snapshot.forEach((docSnap)=>{
  const searchValue =
searchInput.value.toLowerCase();

const order = {
id:docSnap.id,
...docSnap.data()
};
if(!firstOrder){

firstOrder = order;

}
if(
searchValue &&
!order.id
.toLowerCase()
.includes(searchValue)
){
return;
}
window.allOrders.push(order);

const status =
order.status || "Pending";
totalOrders++;

if(status === "Pending"){
pendingOrders++;
}
if(status==="Pending"){
newOrders++;
}
if(status === "Delivered"){
deliveredOrders++;
revenue += Number(order.total || 0);
}
let statusClass = "pending";

if(status==="Accepted"){
statusClass="accepted";
}

if(status==="Preparing"){
statusClass="preparing";
}

if(status==="Out For Delivery"){
statusClass="delivery";
}

if(status==="Delivered"){
statusClass="delivered";
}

if(status==="Rejected"){
statusClass="rejected";
}

const card = document.createElement("div");

card.className = "order-card";

card.innerHTML = `

<div class="order-top">

<div>

<div class="order-id">
#${order.id.slice(0,8)}
</div>

<div class="customer-name">
${order.userName || "Customer"}
</div>

</div>

<div class="order-status ${statusClass}">
${status}
</div>

</div>

<div class="order-total">
₹${order.total}
</div>

<div class="order-time">
${order.orderTime || ""}
</div>

`;

card.onclick = ()=>{

openOrderPopup(order);

};

if(
status==="Delivered" ||
status==="Rejected"
){

historyContainer.appendChild(card);
historyCount++;

}else{

liveContainer.appendChild(card);
liveCount++;

}

});

document.getElementById(
"liveCount"
).innerText =
`${liveCount} Active Orders`;

document.getElementById(
"historyCount"
).innerText =
`${historyCount} Completed Orders`;
if(totalOrdersEl){

totalOrdersEl.innerText =
totalOrders;

pendingOrdersEl.innerText =
pendingOrders;

deliveredOrdersEl.innerText =
deliveredOrders;

todayRevenueEl.innerText =
"₹" + revenue;
// NEW ORDER POPUP

if(firstOrder){

if(firstLoad){

latestOrderId =
firstOrder.id;

firstLoad = false;

}

else if(
latestOrderId !== firstOrder.id
){

latestOrderId =
firstOrder.id;

showNewOrderPopup(firstOrder);

}

}
}

});

// =====================
// POPUP
// =====================

function openOrderPopup(order){

window.currentOrderId =
order.id;

const popup =
document.getElementById("orderPopup");

document.getElementById(
"popupOrderId"
).innerText =
"Order ID : " + order.id;

document.getElementById(
"popupCustomer"
).innerText =
"Customer : " +
(order.userName || "Customer");

document.getElementById(
"popupTotal"
).innerText =
"Total : ₹" + order.total;

document.getElementById(
"popupStatus"
).innerText =
"Status : " + order.status;

document.getElementById("popupAddress").innerHTML = `

<b>${order.address?.fullName || ""}</b>

<br>

📍 ${order.address?.address || ""}

<br>

🏙️ ${order.address?.city || ""}

<br>

📮 ${order.address?.pincode || ""}

<br>

📞 ${order.address?.phone || ""}

${
order.address?.googleMap ?

`<br><br>

<a
href="${order.address.googleMap}"
target="_blank"
style="
display:inline-block;
padding:10px 18px;
background:#ff7a00;
color:#fff;
text-decoration:none;
border-radius:12px;
font-weight:bold;
">

📍 Open In Google Maps

</a>`

: ""

}
`;

let itemsHTML = "";

(order.items || []).forEach(item=>{

itemsHTML += `

<div class="popup-item">

<img src="${item.image}">

<div>

<h4>${item.name}</h4>

<p>
₹${item.price}
× ${item.qty}
</p>

</div>

</div>

`;

});

document.getElementById(
"popupItems"
).innerHTML =
itemsHTML;

updateTimeline(order.status);
updateButtons(order.status);

popup.style.display = "flex";

}

// =====================
// CLOSE
// =====================

document
.getElementById("closeOrderPopup")
.onclick = ()=>{

document.getElementById(
"orderPopup"
).style.display="none";

};

// =====================
// BUTTONS
// =====================

function updateButtons(status){

const acceptBtn =
document.getElementById(
"acceptOrderBtn"
);

const rejectBtn =
document.getElementById(
"rejectOrderBtn"
);

const nextBtn =
document.getElementById(
"nextStatusBtn"
);

if(status==="Pending"){

acceptBtn.style.display =
"block";

rejectBtn.style.display =
"block";

nextBtn.style.display =
"none";

}

else if(

status==="Accepted" ||
status==="Preparing" ||
status==="Out For Delivery"

){

acceptBtn.style.display =
"none";

rejectBtn.style.display =
"none";

nextBtn.style.display =
"block";

}

else{

acceptBtn.style.display =
"none";

rejectBtn.style.display =
"none";

nextBtn.style.display =
"none";

}

}

// =====================
// ACCEPT
// =====================

document
.getElementById("acceptOrderBtn")
.onclick = async ()=>{

await updateDoc(
doc(db,"orders",window.currentOrderId),
{
status:"Accepted"
}
);

const order =
window.allOrders.find(
o=>o.id===window.currentOrderId
);

order.status = "Accepted";

openOrderPopup(order);

};

// =====================
// REJECT
// =====================

document
.getElementById("rejectOrderBtn")
.onclick = async ()=>{

await updateDoc(
doc(db,"orders",window.currentOrderId),
{
status:"Rejected"
}
);

const order =
window.allOrders.find(
o=>o.id===window.currentOrderId
);

order.status = "Rejected";

openOrderPopup(order);

};

// =====================
// NEXT STATUS
// =====================

document
.getElementById("nextStatusBtn")
.onclick = async ()=>{

const order =
window.allOrders.find(
o=>o.id===window.currentOrderId
);

if(!order) return;

let nextStatus="";

if(order.status==="Accepted"){

nextStatus="Preparing";

}
else if(
order.status==="Preparing"
){

nextStatus=
"Out For Delivery";

}
else if(
order.status==="Out For Delivery"
){

nextStatus=
"Delivered";

}

if(nextStatus){

await updateDoc(

doc(
db,
"orders",
window.currentOrderId
),

{
status:nextStatus
}

);
order.status = nextStatus;

openOrderPopup(order);

}

};
document
.getElementById("liveOrdersBtn")
.onclick = ()=>{

document
.getElementById("liveOrdersContainer")
.style.display = "block";

document
.getElementById("historyOrdersContainer")
.style.display = "none";

};

document
.getElementById("historyOrdersBtn")
.onclick = ()=>{

document
.getElementById("liveOrdersContainer")
.style.display = "none";

document
.getElementById("historyOrdersContainer")
.style.display = "block";

};
const liveBtn =
document.getElementById("liveOrdersBtn");

const historyBtn =
document.getElementById("historyOrdersBtn");

liveBtn.onclick = ()=>{

liveBtn.classList.add("active-tab");
historyBtn.classList.remove("active-tab");

document.getElementById(
"liveOrdersContainer"
).style.display = "block";

document.getElementById(
"historyOrdersContainer"
).style.display = "none";

};

historyBtn.onclick = ()=>{

historyBtn.classList.add("active-tab");
liveBtn.classList.remove("active-tab");

document.getElementById(
"liveOrdersContainer"
).style.display = "none";

document.getElementById(
"historyOrdersContainer"
).style.display = "block";

};
if(searchInput){

searchInput.addEventListener("input",()=>{

const searchValue =
searchInput.value.toLowerCase();

document
.querySelectorAll(".order-card")
.forEach(card=>{

const id =
card.querySelector(".order-id")
.innerText
.toLowerCase();

if(id.includes(searchValue)){

card.style.display = "block";

}else{

card.style.display = "none";

}

});

});

}
document
.getElementById("notificationBell")
?.addEventListener("click",()=>{

liveBtn.click();

const cards =
document.querySelectorAll(".order-card");

cards.forEach(card=>{

const status =
card.querySelector(".order-status")
?.innerText;

if(status !== "Pending"){

card.style.display = "none";

}else{

card.style.display = "block";

}

});

});
function showNewOrderPopup(order){

document
.getElementById("alertCustomer")
.innerText =
order.userName || "Customer";

document
.getElementById("alertAmount")
.innerText =
"₹" + order.total;

document
.getElementById("newOrderAlert")
.style.display =
"flex";

todayOrderCount++;

const today = new Date().toDateString();

if (!lastOrderDate) {
  lastOrderDate = today;
}

if (lastOrderDate !== today) {
  todayOrderCount = 1;
  lastOrderDate = today;
}

playLoudSound();
speakOrderNumber(todayOrderCount);

window.latestPopupOrder =
order;

}

document
.getElementById("viewNewOrderBtn")
.onclick = ()=>{

document
.getElementById("newOrderAlert")
.style.display =
"none";

openOrderPopup(
window.latestPopupOrder
);

};

document
.getElementById("newOrderAlert")
.onclick = (e)=>{

if(
e.target.id==="newOrderAlert"
){

document
.getElementById("newOrderAlert")
.style.display =
"none";

}

};
function updateTimeline(status){

document
.querySelectorAll(".timeline-step")
.forEach(step=>{

step.classList.remove(
"timeline-active"
);

});

const steps = {

"Pending":[
"stepPending"
],

"Accepted":[
"stepPending",
"stepAccepted"
],

"Preparing":[
"stepPending",
"stepAccepted",
"stepPreparing"
],

"Out For Delivery":[
"stepPending",
"stepAccepted",
"stepPreparing",
"stepDelivery"
],

"Delivered":[
"stepPending",
"stepAccepted",
"stepPreparing",
"stepDelivery",
"stepDelivered"
]

};

(
steps[status] || []
).forEach(id=>{

document
.getElementById(id)
?.classList.add(
"timeline-active"
);

});

}
