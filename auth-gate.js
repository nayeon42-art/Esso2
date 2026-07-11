import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// -------- صفحة تسجيل الدخول (login.html) --------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const statusEl = document.getElementById('loginStatus');
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const submitLabel = submitBtn.textContent;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    statusEl.hidden = true;
    statusEl.classList.remove('is-error');
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري الدخول...';

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'dashboard.html';
    } catch (err) {
      statusEl.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      statusEl.classList.add('is-error');
      statusEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  });

  // إظهار/إخفاء كلمة المرور
  const pwToggle = document.querySelector('.pw-toggle');
  const pwInput = document.getElementById('loginPassword');
  if (pwToggle && pwInput) {
    pwToggle.addEventListener('click', () => {
      pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
    });
  }
}

// -------- صفحة لوحة التحكم (dashboard.html) --------
const dashSidebar = document.querySelector('.dash-sidebar');
if (dashSidebar) {
  // مخفية لحد ما نتأكد إن فيه مستخدم مسجل دخول فعلاً، عشان محدش يشوف البيانات للحظة قبل التحويل
  document.body.style.visibility = 'hidden';

  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.body.style.visibility = 'visible';
    } else {
      window.location.href = 'login.html';
    }
  });

  const logoutLink = document.querySelector('.logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      await signOut(auth);
      window.location.href = 'login.html';
    });
  }
}
