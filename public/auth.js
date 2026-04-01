const API_URL = 'http://localhost:5000/api';

// Toggle between Login and Signup forms
function toggleForms() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  loginForm.classList.toggle('active');
  signupForm.classList.toggle('active');

  // Clear forms and messages when switching
  document.getElementById('loginFormElement').reset();
  document.getElementById('signupFormElement').reset();
  document.getElementById('loginMessage').textContent = '';
  document.getElementById('signupMessage').textContent = '';
}

// Handle Login
document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('loginMessage');
  const submitBtn = e.target.querySelector('.btn-submit');

  try {
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Logging in...';

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Show success message
    messageDiv.textContent = 'Login successful! Redirecting...';
    messageDiv.className = 'form-message success';

    // Redirect after 1 second
    setTimeout(() => {
      window.location.href = '/browse.html';
    }, 1000);
  } catch (error) {
    messageDiv.textContent = error.message;
    messageDiv.className = 'form-message error';
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.textContent = 'Login';
  }
});

// Handle Sign Up
document.getElementById('signupFormElement').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const college = document.getElementById('signupCollege').value;
  const phone = document.getElementById('signupPhone').value;
  const password = document.getElementById('signupPassword').value;
  const messageDiv = document.getElementById('signupMessage');
  const submitBtn = e.target.querySelector('.btn-submit');

  // Basic validation
  if (password.length < 6) {
    messageDiv.textContent = 'Password must be at least 6 characters';
    messageDiv.className = 'form-message error';
    return;
  }

  if (phone.length < 10) {
    messageDiv.textContent = 'Please enter a valid 10-digit phone number';
    messageDiv.className = 'form-message error';
    return;
  }

  try {
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Creating Account...';

    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        college,
        phone,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Show success message
    messageDiv.textContent = 'Account created successfully! Redirecting...';
    messageDiv.className = 'form-message success';

    // Redirect after 1 second
    setTimeout(() => {
      window.location.href = '/browse.html';
    }, 1000);
  } catch (error) {
    messageDiv.textContent = error.message;
    messageDiv.className = 'form-message error';
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.textContent = 'Sign Up';
  }
});

// Check if user is already logged in
window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  if (token) {
    // User is already logged in, redirect to browse
    window.location.href = '/browse.html';
  }
});
