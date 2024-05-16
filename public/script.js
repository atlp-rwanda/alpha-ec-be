/* eslint-disable */
import { io } from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js';

const email = document.querySelector('#email');
const password = document.querySelector('#password');
const loader = document.querySelector('.loader');
const loginForm = document.getElementById('loginForm');
const verifyForm = document.getElementById('verifyForm');
const homePage = document.querySelector('#homePage');

const list = document.querySelector('#notify');
const socket = io();

const API = 'http://localhost:3000';
let OTP_Token = '';

loginForm.addEventListener('submit', async e => {
  e.preventDefault();

  loader.classList.add('show');
  const response = await fetch(`${API}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });
  const result = await response.json();

  if (result.message === 'Verify OTP sent to your email to continue') {
    loader.classList.remove('show');
    loginForm.style.display = 'none';
    verifyForm.style.display = 'block';
    OTP_Token = result.data;
    Toastify({
      text: result.message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      stopOnFocus: true,
    }).showToast();
  } else {
    loader.classList.remove('show');
    Toastify({
      text: result.message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      stopOnFocus: true,
    }).showToast();
  }
});

verifyForm.addEventListener('submit', async e => {
  e.preventDefault();
  loader.classList.add('show');
  const OTP = document.querySelector('#otp').value;
  const response = await fetch(`${API}/api/users/verify/${OTP_Token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      otp: OTP,
    }),
  });
  const result = await response.json();

  if (result.data) {
    loader.classList.remove('show');
    verifyForm.style.display = 'none';
    homePage.style.display = 'flex';
    localStorage.setItem('token', result.data);
    getNotifications(result.data);
    Toastify({
      text: result.message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      stopOnFocus: true,
    }).showToast();
  } else {
    loader.classList.remove('show');
    Toastify({
      text: result.message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
      stopOnFocus: true,
    }).showToast();
  }
});

const getNotifications = async token => {
  const response = await fetch(`${API}/api/users/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();

  if (result.data) {
    const userId = result.data.id;
    socket.on('connect', () => {
      console.log(socket.connected);
    });

    socket.emit(userId, arg => {
      list.innerHTML += `<li><div><span></span><p>${arg.user.name}</p></div> <p>${arg.message}</p></li>`;
    });
  }
};