import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
console.log(
"Products Page Loaded 🔥"
);

const popup =
document.getElementById(
"productPopup"
);
let editingProductId = null;
document
.getElementById(
"addProductBtn"
)
.addEventListener(
"click",
async()=>{

popup.style.display =
"flex";

}
);

document
.getElementById(
"closePopupBtn"
)
.addEventListener(
"click",
async()=>{

popup.style.display =
"none";

}
);

document
.getElementById(
"saveProductBtn"
)
.addEventListener(
"click",
async()=>{

const name =
document.getElementById(
"productName"
).value;

const price =
document.getElementById(
"productPrice"
).value;

const category =
document.getElementById(
"productCategory"
).value;

const description =
document.getElementById(
"productDescription"
).value;

const image =
document.getElementById(
"productImage"
).value;

const model3D =
document.getElementById(
"productModel3D"
).value;

const foodType =
document.getElementById(
"foodType"
).value;

const stock =
document.getElementById(
"stockStatus"
).value;
if(editingProductId){

await updateDoc(
doc(
db,
"products",
editingProductId
),
{

name:name,

price:price,

category:category,

description:description,

image:image,

model3D:model3D,

foodType:foodType,

stock:stock

}

);

editingProductId = null;

}else{

await addDoc(
collection(db,"products"),
{

name:name,

price:price,

category:category,

description:description,

image:image,

model3D:model3D,

foodType:foodType,

stock:stock,

createdAt:Date.now()

}

);

}

loadProducts();
popup.style.display =
"none";

}
);

const imageInput =

document.getElementById(
"productImage"
);

const preview =

document.getElementById(
"imagePreview"
);

imageInput.addEventListener(
"input",
()=>{

preview.src =
imageInput.value;

preview.style.display =
"block";

}
);
async function loadProducts(){

const container =
document.getElementById(
"productsContainer"
);

container.innerHTML = "";

const snap =
await getDocs(
collection(db,"products")
);

snap.forEach((productDoc)=>{

const data = productDoc.data();
container.innerHTML += `

<div class="product-admin-card">

<img
src="${data.image}"
style="
width:100%;
height:180px;
object-fit:cover;
border-radius:15px;
margin-bottom:15px;
">

<h3>${data.name}</h3>

<p>₹${data.price}</p>

<p>Category: ${data.category}</p>

<p>Food Type: ${data.foodType}</p>

<p>Stock: ${data.stock}</p>

<p>${data.description}</p>

<div class="product-actions">

<button
class="editBtn"
data-id="${productDoc.id}"
>
Edit
</button>

<button
class="deleteBtn"
data-id="${productDoc.id}"
>
Delete
</button>

</div>

</div>

`;

});
document
.querySelectorAll(
".deleteBtn"
)
.forEach((btn)=>{

btn.addEventListener(
"click",
async()=>{

const id =
btn.dataset.id;

await deleteDoc(
doc(
db,
"products",
id
)
);

loadProducts();

}
);

});
document
.querySelectorAll(
".editBtn"
)
.forEach((btn)=>{

btn.addEventListener(
"click",
async()=>{

const id =
btn.dataset.id;

const product =
snap.docs.find(
d => d.id === id
);

const data =
product.data();

document.getElementById(
"productName"
).value = data.name;

document.getElementById(
"productPrice"
).value = data.price;

document.getElementById(
"productCategory"
).value = data.category;

document.getElementById(
"productDescription"
).value = data.description;

document.getElementById(
"productImage"
).value = data.image;

document.getElementById(
"productModel3D"
).value =
data.model3D || "";

document.getElementById(
"foodType"
).value = data.foodType;

document.getElementById(
"stockStatus"
).value = data.stock;

editingProductId = id;

popup.style.display =
"flex";

}
);

});

}

loadProducts();