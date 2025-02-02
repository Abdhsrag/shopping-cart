// Check authentication status immediately when page loads
function checkAuth() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!userData || !token) {
    window.location.replace("../index.html");
    return false;
  }
  return true;
}

// Run auth check before anything else
if (!checkAuth()) {
  console.log("Auth check failed - stopping page load");
} else {
  const userData = JSON.parse(localStorage.getItem("user"));

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
}
