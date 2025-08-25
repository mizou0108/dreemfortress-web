// 🧠 DreemSession.js — بصيغة ES Modules

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { verifySession } from "./DreemVerifier.js";

// ⚙️ تحميل إعدادات البيئة
dotenv.config();
// 🔐 إعدادات Firebase من .env
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};
console.log("📦 FirebaseConfig:", firebaseConfig);
// 🚀 تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🧾 تسجيل الدخول واسترجاع uid
signInWithEmailAndPassword(auth, process.env.FIREBASE_EMAIL, process.env.FIREBASE_PASSWORD)
  .then((userCredential) => {
    const uid = userCredential.user.uid;
    const timestamp = new Date().toISOString();

    // 🗂️ أرشفة uid مع توقيع قانوني
    const logPath = path.join(path.resolve(), "session.log");
    const logEntry = `[${timestamp}] ✅ DreemSession: تسجيل دخول ناجح - uid: ${uid}\n`;

    fs.appendFileSync(logPath, logEntry);
    console.log("✅ تسجيل دخول ناجح:", uid);
    console.log("📁 تم أرشفة الجلسة في:", logPath);

    // ✅ التحقق من الجلسة
    verifySession(uid);
  })
  .catch((error) => {
    const timestamp = new Date().toISOString();
    const errorEntry = `[${timestamp}] ❌ DreemSession: فشل تسجيل الدخول - ${error.message}\n`;

    fs.appendFileSync(path.join(path.resolve(), "session.log"), errorEntry);
    console.error("❌ فشل تسجيل الدخول:", error.message);
  });
