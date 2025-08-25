import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import * as crypto from "node:crypto";
import axios from "axios";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCezm-Er0mUKRNxzyL4pVL_JMpgMoHLJnQ",
  authDomain: "dreemfortress.firebaseapp.com",
  projectId: "dreemfortress",
  storageBucket: "dreemfortress.firebasestorage.app",
  messagingSenderId: "133008895297",
  appId: "1:133008895297:web:08ab9f65ad6cf4b51d05c0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// توليد توقيع قانوني
function generateSignature(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

// إرسال تنبيه Telegram (اختياري)
async function notifyTelegram(message) {
  const token = "YOUR_BOT_TOKEN";     // ← ضع توكن البوت هنا
  const chatId = "YOUR_CHAT_ID";      // ← ضع معرف الشات هنا
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message
    });
  } catch (error) {
    console.error("⚠️ فشل إرسال التنبيه:", error.message);
  }
}

// حفظ سجل DreemLogger
async function logScanResult() {
  const payload = {
    type: "xss",
    value: "<img src=x onerror=alert('Dreem')>"
  };

  const response = {
    status: 200,
    body: "Payload executed"
  };

  const data = {
    scan_id: `dreem-${Date.now()}`,
    target: "192.168.1.10",
    payload,
    response,
    verified: true,
    signature: generateSignature({ payload, response }),
    timestamp: new Date(),
    notified: false,
    session_ref: "session-20250813-1830",
    tunnel_info: {
      protocol: "ssh",
      port: 80
    }
  };

  try {
    const docRef = await addDoc(collection(db, "dreem_logs"), data);
    console.log("✅ سجل DreemLogger تم حفظه:", docRef.id);
    await notifyTelegram(`📡 DreemLogger سجل جديد: ${data.scan_id}`);
  } catch (error) {
    console.error("❌ فشل حفظ السجل:", error.message);
  }
}

logScanResult();
