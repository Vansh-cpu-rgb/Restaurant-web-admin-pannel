import { db } from "./firebase.js";

import {
collection,
query,
orderBy,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ======================
// ELEMENTS
// ======================

const reviewsContainer =
document.getElementById("reviewsContainer");

const avgRating =
document.getElementById("avgRating");

const reviewCount =
document.getElementById("reviewCount");

const fiveStarCount =
document.getElementById("fiveStarCount");

const searchReview =
document.getElementById("searchReview");

const ratingFilter =
document.getElementById("ratingFilter");

// ======================
// GLOBAL DATA
// ======================

let allReviews = [];

// ======================
// LOAD REVIEWS
// ======================

function loadReviews(){

const q = query(

collection(db,"reviews"),

orderBy("createdAt","desc")

);

onSnapshot(q,(snapshot)=>{

allReviews = [];

snapshot.forEach((doc)=>{

allReviews.push({

id:doc.id,

...doc.data()

});

});

updateSummary(allReviews);

renderReviews(allReviews);

});

}

loadReviews();
// ======================
// UPDATE SUMMARY
// ======================

function updateSummary(reviews){

let totalRating = 0;

let fiveStars = 0;

reviews.forEach((review)=>{

totalRating += Number(review.foodRating || 0);

if(Number(review.foodRating) === 5){

fiveStars++;

}

});

const average =

reviews.length > 0

?

(totalRating / reviews.length).toFixed(1)

:

"0.0";

avgRating.innerText = average;

reviewCount.innerText = reviews.length;

fiveStarCount.innerText = fiveStars;

}

// ======================
// RENDER REVIEWS
// ======================

function renderReviews(reviews){

if(reviews.length === 0){

reviewsContainer.innerHTML = `

<div class="empty-review">

<h2>⭐ No Reviews Yet</h2>

<p>Customer reviews will appear here.</p>

</div>

`;

return;

}

let html = "";

reviews.forEach((review)=>{

const stars =

"★".repeat(Number(review.foodRating || 0)) +

"☆".repeat(5 - Number(review.foodRating || 0));

const reviewDate =

review.createdAt

?

new Date(

review.createdAt.seconds * 1000

).toLocaleDateString("en-IN",{

day:"numeric",

month:"short",

year:"numeric"

})

:

"";

html += `

<div class="review-card">

<div class="review-header">

<div class="review-user">

<img src="${review.image || 'https://placehold.co/80x80'}">

<div>

<h3>${review.productName || "Food Item"}</h3>

<p>${review.userName || "Customer"}</p>

</div>

</div>

<div class="review-stars">

${stars}

</div>

</div>

<div class="review-comment">

${review.review || "No comment provided."}

</div>

<div class="rider-rating">

🚴 Rider Rating :
<b>

${review.riderRating || 0}

★</b>

</div>

<div class="review-footer">

<span>

📅 ${reviewDate}

</span>

<span class="verified-badge">

✅ Verified Order

</span>

</div>

</div>

`;

});

reviewsContainer.innerHTML = html;

}
// ======================
// SEARCH + FILTER
// ======================

searchReview.addEventListener("input", filterReviews);

ratingFilter.addEventListener("change", filterReviews);

function filterReviews(){

const search =
searchReview.value
.toLowerCase()
.trim();

const rating =
ratingFilter.value;

const filtered =

allReviews.filter((review)=>{

const productName =
(review.productName || "")
.toLowerCase();

const matchSearch =
productName.includes(search);

const matchRating =

rating === "all"

?

true

:

Number(review.foodRating) === Number(rating);

return matchSearch && matchRating;

});

updateSummary(filtered);

renderReviews(filtered);

}
// ======================
// RELATIVE TIME
// ======================

function timeAgo(timestamp){

if(!timestamp) return "";

const date = timestamp.seconds
? new Date(timestamp.seconds * 1000)
: new Date(timestamp);

const seconds =
Math.floor((Date.now()-date.getTime())/1000);

const minutes =
Math.floor(seconds/60);

const hours =
Math.floor(minutes/60);

const days =
Math.floor(hours/24);

if(days>0){
return days + " day" + (days>1?"s":"") + " ago";
}

if(hours>0){
return hours + " hour" + (hours>1?"s":"") + " ago";
}

if(minutes>0){
return minutes + " min ago";
}

return "Just Now";

}

// ======================
// CLICK ANIMATION
// ======================

document.addEventListener("click",(e)=>{

const card =
e.target.closest(".review-card");

if(!card) return;

card.style.transform = "scale(.98)";

setTimeout(()=>{

card.style.transform = "";

},150);

});

// ======================
// LIVE STATUS
// ======================

console.log("✅ Admin Reviews Loaded");

// ======================
// FUTURE FEATURES
// ======================
//
// ✔ Delete Review
// ✔ Reply To Review
// ✔ Pin Review
// ✔ Export Reviews
// ✔ Analytics
//