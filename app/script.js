// Selectors
const signinBtn = document.querySelector('.signinBtn');
const signupBtn = document.querySelector('.signupBtn');
const form = document.querySelector('.form');
const register = document.querySelector('.register');
const registerBtn = document.querySelector('.reBtn');
const forgotBtn = document.querySelector('.forgotBtn');
const forgot = document.querySelector('.forgot');
const loginBtn = document.querySelector('.loginBtn'); 

// Helper Functions for Validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const isValidName = (name) => {
  // Name must only contain alphabetic characters and be between 2 and 50 characters
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
};

const displayError = (message) => {
  alert(message); 
};

// Toggle Password Visibility
const togglePasswordVisibility = () => {
  const toggles = document.querySelectorAll('.toggle-password'); 
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const input = document.getElementById(toggle.dataset.toggle); 
      if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈'; 
      } else {
        input.type = 'password';
        toggle.textContent = '👁️'; 
      }
    });
  });
};


togglePasswordVisibility();

// Handle Sign-in Button Click
signinBtn.addEventListener('click', function (event) {
  event.preventDefault();
  form.classList.remove('disable');
  signupBtn.classList.add('disable');
  signinBtn.classList.add('disable');
});

// Handle Sign-up Button Click
signupBtn.addEventListener('click', function (event) {
  event.preventDefault();
  signinBtn.classList.add('disable');
  signupBtn.classList.add('disable');
  register.classList.remove('disable');
});

// Handle Forgot Password Button Click
forgotBtn.addEventListener('click', function (event) {
  event.preventDefault();
  signinBtn.classList.add('disable');
  signupBtn.classList.add('disable');
  form.classList.add('disable');
  forgot.classList.remove('disable');
});

// Handle Login
const login = () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!isValidEmail(email)) {
    displayError('Invalid email format. Please enter a valid email address.');
    return;
  }

  if (!isValidPassword(password)) {
    displayError(
      'Invalid password format. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    );
    return;
  }

  const userData = JSON.parse(localStorage.getItem('user'));

  if (userData && userData.email === email && userData.password === password) {
    window.location.href = 'pages/home.html'; 
  } else {
    displayError('Invalid email or password!');
  }
};

loginBtn.addEventListener('click', function (event) {
  event.preventDefault(); 
  login();
});

// Access Control for Home Page
if (window.location.pathname.includes('home.html')) {
  const userData = localStorage.getItem('user');
  if (!userData) {
    window.location.href = '../index.html'; 
  }
}

// Handle Registration
const registerForm = document.querySelector('.register form');
registerForm.addEventListener('submit', function (event) {
  event.preventDefault(); 
  const name = document.getElementById('name').value;
  const newEmail = document.getElementById('newEmail').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!isValidName(name)) {
    displayError(
      'Invalid name format. Name should only contain alphabetic characters and be between 2 and 50 characters long.'
    );
    return;
  }

  if (!isValidEmail(newEmail)) {
    displayError('Invalid email format. Please enter a valid email address.');
    return;
  }

  if (!isValidPassword(newPassword)) {
    displayError(
      'Invalid password format. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    displayError('Passwords do not match!');
    return;
  }

  localStorage.setItem(
    'user',
    JSON.stringify({ name, email: newEmail, password: newPassword })
  ); 
  alert('Registration successful! Redirecting to login...');
  window.location.href = 'index.html'; 
});

// Handle Password Reset
const forgotForm = document.querySelector('.forgot form');
if (forgotForm) {
  forgotForm.addEventListener('submit', function (event) {
    event.preventDefault(); 
    const email = document.getElementById('forgotEmail').value;
    const newPassword = document.getElementById('CrtNewPassword').value;
    const confirmChangedPassword = document.getElementById(
      'confirmChangedPassword'
    ).value;

    if (!isValidEmail(email)) {
      displayError('Invalid email format. Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(newPassword)) {
      displayError(
        'Invalid password format. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    if (newPassword !== confirmChangedPassword) {
      displayError('Passwords do not match!');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData && userData.email === email) {
      userData.password = newPassword;
      localStorage.setItem('user', JSON.stringify(userData)); 
      alert('Password reset successful! You can now log in with your new password.');
      window.location.href = 'index.html'; 
    } else {
      displayError('Email not found!');
    }
  });
}
