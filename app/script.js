// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Selectors
  const signinBtn = document.querySelector(".signinBtn");
  const signupBtn = document.querySelector(".signupBtn");
  const form = document.querySelector(".form");
  const register = document.querySelector(".register");
  const registerBtn = document.querySelector(".reBtn");
  const forgotBtn = document.querySelector(".forgotBtn");
  const forgot = document.querySelector(".forgot");
  const loginBtn = document.querySelector(".loginBtn");

  // Helper Functions for Validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  function isValidName(name) {
    return name.length >= 2;
  }

  function displayError(message, elementId = null) {
    if (elementId) {
      const errorElement = document.getElementById(elementId);
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
      }
    } else {
      alert(message);
    }
  }

  function clearErrors() {
    document.querySelectorAll(".error-message").forEach((el) => {
      el.textContent = "";
      el.style.display = "none";
    });
  }

  // Toggle Password Visibility
  document.querySelectorAll(".toggle-password").forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const targetId = this.getAttribute("data-toggle");
      const passwordInput = document.getElementById(targetId);

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.textContent = "👁️";
      } else {
        passwordInput.type = "password";
        this.textContent = "👁️";
      }
    });
  });

  // Handle Sign-in Button Click
  signinBtn.addEventListener("click", function (event) {
    event.preventDefault();
    form.classList.remove("disable");
    signupBtn.classList.add("disable");
    signinBtn.classList.add("disable");
  });

  // Handle Sign-up Button Click
  signupBtn.addEventListener("click", function (event) {
    event.preventDefault();
    signinBtn.classList.add("disable");
    signupBtn.classList.add("disable");
    register.classList.remove("disable");
  });

  // Handle Forgot Password Button Click
  forgotBtn.addEventListener("click", function (event) {
    event.preventDefault();
    signinBtn.classList.add("disable");
    signupBtn.classList.add("disable");
    form.classList.add("disable");
    forgot.classList.remove("disable");
  });

  // Registration handling
  const registerForm = document.querySelector('form[action="register"]');
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("newEmail").value;
      const password = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // Clear previous error messages
      clearErrors();

      // Validate inputs
      if (!isValidName(name)) {
        displayError(
          "Invalid name format. Name must be at least 2 characters long.",
          "nameError"
        );
        return;
      }

      if (!isValidEmail(email)) {
        displayError(
          "Invalid email format. Please enter a valid email address.",
          "emailError"
        );
        return;
      }

      if (!isValidPassword(password)) {
        displayError(
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
          "passwordError"
        );
        return;
      }

      if (password !== confirmPassword) {
        displayError("Passwords do not match!", "confirmPasswordError");
        return;
      }

      // Get existing users or initialize empty array
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Check if email already exists
      if (users.some((user) => user.email === email)) {
        displayError("Email already registered!", "emailError");
        return;
      }

      // Create new user object
      const newUser = {
        name: name,
        email: email,
        password: password,
      };

      // Add new user to array
      users.push(newUser);

      // Save updated users array
      localStorage.setItem("users", JSON.stringify(users));

      // Clear form
      registerForm.reset();

      // Show success message
      alert("Registration successful! Please login.");

      // Switch to login form
      document.querySelector(".register").classList.add("disable");
      document.querySelector(".form").classList.remove("disable");
    });
  }

  // Login handling
  const login = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!isValidEmail(email)) {
      displayError("Invalid email format. Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(password)) {
      displayError(
        "Invalid password format. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    // Get users array from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching email and password
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Store current user data
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Generate and store token
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2);
      const token = btoa(`${email}:${timestamp}:${randomString}`);
      localStorage.setItem("token", token);

      window.location.href = "pages/home.html";
    } else {
      displayError("Invalid email or password!");
    }
  };

  loginBtn.addEventListener("click", function (event) {
    event.preventDefault();
    login();
  });

  // Handle Password Reset
  const forgotForm = document.querySelector(".forgot form");
  if (forgotForm) {
    forgotForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("forgotEmail").value;
      const newPassword = document.getElementById("CrtNewPassword").value;
      const confirmChangedPassword = document.getElementById(
        "confirmChangedPassword"
      ).value;

      if (!isValidEmail(email)) {
        displayError(
          "Invalid email format. Please enter a valid email address."
        );
        return;
      }

      if (!isValidPassword(newPassword)) {
        displayError(
          "Invalid password format. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
        return;
      }

      if (newPassword !== confirmChangedPassword) {
        displayError("Passwords do not match!");
        return;
      }

      // Get users array from localStorage
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Find user with matching email
      const user = users.find((u) => u.email === email);

      if (user) {
        // Update user's password
        user.password = newPassword;

        // Save updated users array
        localStorage.setItem("users", JSON.stringify(users));

        alert(
          "Password reset successful! You can now log in with your new password."
        );
        window.location.href = "index.html";
      } else {
        displayError("Email not found!");
      }
    });
  }

  // Access Control for Home Page
  if (window.location.pathname.includes("home.html")) {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "../index.html";
    }
  }

  if (window.location.pathname.includes("logout.html")) {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "../index.html";
    }
  }

  if (window.location.pathname.includes("cart.html")) {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "../index.html";
    }
  }
});
