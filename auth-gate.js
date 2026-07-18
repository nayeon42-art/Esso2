import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// ============================================================
// 🔑 كود الدخول الخاص بالموظفين — غيّريه لأي كود تختاريه،
// وابعتيه للموظفين بس (واتساب، مكالمة...) مش على الموقع نفسه.
// ملحوظة: أي حد يفتح كود الصفحة (View Source) هيقدر يشوف الكود ده،
// فهو مجرد فلتر بسيط يمنع التسجيل العشوائي، مش حماية قوية 100%.
// لو حسيتي إنه اتسرب، غيّريه في أي وقت من هنا.
// ============================================================
const STAFF_ACCESS_CODE = "ESSO-STAFF-meles7";

// -------- صفحة إنشاء حساب جديد (register.html) --------
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  const statusEl = document.getElementById('registerStatus');
  const submitBtn = registerForm.querySelector('button[type="submit"]');
  const submitLabel = submitBtn.textContent;

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const code = document.getElementById('regCode').value.trim();

    statusEl.hidden = true;
    statusEl.classList.remove('is-error');

    if (code !== STAFF_ACCESS_CODE) {
      statusEl.textContent = 'كود الدخول غلط، تأكدي منه مع المسؤولة';
      statusEl.classList.add('is-error');
      statusEl.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري إنشاء الحساب...';

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      window.location.href = 'dashboard.html';
    } catch (err) {
      let msg = 'حصل خطأ أثناء إنشاء الحساب، حاولي تاني';
      if (err.code === 'auth/email-already-in-use') msg = 'البريد الإلكتروني ده متسجل بحساب قبل كده';
      if (err.code === 'auth/weak-password') msg = 'كلمة المرور لازم تكون 6 أحرف على الأقل';
      if (err.code === 'auth/invalid-email') msg = 'البريد الإلكتروني مش صحيح';
      statusEl.textContent = msg;
      statusEl.classList.add('is-error');
      statusEl.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  });

  const regPwToggle = document.querySelector('.pw-toggle');
  const regPwInput = document.getElementById('regPassword');
  if (regPwToggle && regPwInput) {
    regPwToggle.addEventListener('click', () => {
      regPwInput.type = regPwInput.type === 'password' ? 'text' : 'password';
    });
  }
}

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
