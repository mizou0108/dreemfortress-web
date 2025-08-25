// 🧠 DreemAuthVerifier.js — وحدة تحقق وتوثيق وتنبيه مؤتمتة

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

dotenv.config();

// 🔐 إعدادات Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// 🚀 تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 📧 بيانات الدخول
const email = process.env.FIREBASE_EMAIL;
const password = process.env.FIREBASE_PASSWORD;

// 🆔 uid الثابت من DreemSession
const fixedUid = "Ek3dxJrhP4OUq9aXIgorUJHJ5F63";

// 🔏 توقيع رقمي باستخدام HMAC
function signLog(log) {
  const secret = process.env.SIGNATURE_SECRET || "hamza_signature";
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(JSON.stringify(log));
  return hmac.digest("hex");
}

// 📉 تسجيل الفشل في DreemErrors
function logError(error, context = "unknown") {
  const dir = "DreemErrors";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const file = path.join(dir, `${new Date().toISOString().split("T")[0]}.log`);
  const entry = `[${new Date().toISOString()}] [${context}] ${error}\n`;
  fs.appendFileSync(file, entry);
}

// 📡 إرسال تنبيه Telegram
async function sendTelegramAlert(log) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const message = `
📡 DreemAuthVerifier Alert
👤 UID: ${log.uid}
📧 Email: ${log.email}
📅 Time: ${log.timestamp}
✅ Status: ${log.status}
🔏 Signature: ${log.signature}
  `.trim();

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });
    console.log("📨 تم إرسال التنبيه إلى Telegram");
  } catch (error) {
    console.error("❌ فشل إرسال التنبيه:", error.message);
    logError(error.message, "Telegram");
  }
}

// 🗃️ أرشفة الجلسة حسب uid والتاريخ
function archiveLog(log) {
  const date = new Date().toISOString().split("T")[0];
  const dir = path.join("DreemLogs", log.uid);
  const filePath = path.join(dir, `${date}.json`);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let logs = [];
  if (fs.existsSync(filePath)) {
    logs = JSON.parse(fs.readFileSync(filePath));
  }

  logs.push(log);
  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
  console.log("🗃️ تم أرشفة الجلسة قانونيًا:", filePath);
}

// 🚀 تنفيذ التحقق وتوثيق الجلسة
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const uid = userCredential.user.uid;
    const timestamp = new Date().toISOString();
    const status = uid === fixedUid ? "verified" : "mismatch";

    const sessionLog = {
      uid: fixedUid,
      email,
      timestamp,
      session: "DreemAuthVerifier.js",
      status,
      signature: signLog({ uid: fixedUid, email, timestamp, status }),
    };

    console.log("✅ جلسة موثقة:", sessionLog);

    sendTelegramAlert(sessionLog);
    archiveLog(sessionLog);
  })
  .catch((error) => {
    console.error("❌ فشل التحقق:", error.message);
    logError(error.message, "FirebaseAuth");
  });
