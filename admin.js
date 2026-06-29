window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";

  // auto login
  const session = localStorage.getItem("adminSession");
  if (session === "active") {
    window.location.href = "dashboard.html";
  }
});

document.getElementById("loginBtn").addEventListener("click", () => {

  const code = document.getElementById("adminCode").value;
  const password = document.getElementById("adminPassword").value;

  // 👉 FIXED ADMIN CREDENTIALS (tum change kar sakte ho)
  const ADMIN_CODE = "FOOD123";
  const ADMIN_PASSWORD = "admin@123";

  if (code === ADMIN_CODE && password === ADMIN_PASSWORD) {

    localStorage.setItem("adminSession", "active");

    // optional (future use)
    localStorage.setItem("adminLoginTime", Date.now());

    window.location.href = "dashboard.html";

  } else {
    alert("Wrong Code or Password ❌");
  }
});