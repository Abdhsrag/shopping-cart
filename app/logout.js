// Run auth check before anything else


  // Handle Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // Clear all authentication data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");

      // Redirect to login page
      window.location.replace("../index.html");
    });
  }

  // Display user name if navbar exists
  const userNameElement = document.getElementById("userName");
  if (userNameElement && userData) {
    userNameElement.textContent = `Welcome, ${userData.name}`;
  }

