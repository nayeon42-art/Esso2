// ============================================================
// 🔑 إعدادات Firebase — لازم تستبدلي القيم دي ببيانات مشروعك
// هتلاقيها في: Firebase Console → Project settings → Your apps
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnIUNLi0aVqnLZIoW8hFIxEwODqLJqCes",
  authDomain: "esso-68489.firebaseapp.com",
  projectId: "esso-68489",
  storageBucket: "esso-68489.firebasestorage.app",
  messagingSenderId: "210678566670",
  appId: "1:210678566670:web:76dc0a69caec85b71c515f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
