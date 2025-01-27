document.addEventListener('DOMContentLoaded', function() {
  const logoutButton = document.getElementById('logoutBtn');
  if (logoutButton) {
    logoutButton.addEventListener('click', function(event) {
      event.preventDefault();
      // Redirect to login page
      window.location.href = '../index.html'; 
    });
  }
});
