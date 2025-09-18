// Login page functionality

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const passwordToggle = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');

  // Handle login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in real app, this would be server-side)
    if (username && password) {
      // Store login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      
      // Redirect to dashboard
      window.location.href = '../dashboard/dashboard.html';
    } else {
      alert('Please enter both username and password');
    }
  });

  // Password toggle functionality
  passwordToggle.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    // Update icon (optional enhancement)
    const icon = passwordToggle.querySelector('svg path');
    if (type === 'text') {
      // Show "eye-off" icon
      icon.setAttribute('d', 'M2 2L18 18M9.58 9.58C9.22 9.93 9 10.44 9 11C9 12.1 9.9 13 11 13C11.56 13 12.07 12.78 12.42 12.42M15 15C13.89 15.53 12.5 16 11 16C6 16 2.73 11.89 2 9C2.52 7.11 3.67 5.39 5.24 4.24M7 7C8.32 6.36 9.64 6 11 6C16 6 19.27 10.11 20 13C19.64 14.19 19.07 15.3 18.32 16.24');
    } else {
      // Show "eye" icon
      icon.setAttribute('d', 'M10 3C5 3 1.73 7.11 1 10C1.73 12.89 5 17 10 17S18.27 12.89 19 10C18.27 7.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10S7.24 5 10 5S15 7.24 15 10S12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10S8.34 13 10 13S13 11.66 13 10S11.66 7 10 7Z');
    }
  });

  // Auto-focus username field
  document.getElementById('username').focus();
});