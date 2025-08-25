import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * 🛡️ إرسال تنبيه Telegram مع أرشفة قانونية
 * @param {Object} log - سجل الجلسة (uid, email, timestamp, status)
 */
export async function sendTelegramAlert(log) {
  const message = `
📡 DreemAuthVerifier Alert
👤 UID: ${log.uid}
📧 Email: ${log.email}
📅 Time: ${log.timestamp}
✅ Status: ${log.status}
  `.trim();

  try {
    // إرسال التنبيه
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
    });

    console.log("📨 تم إرسال التنبيه إلى Telegram");

    // أرشفة قانونية
    archiveLog(log);
  } catch (error) {
    console.error("❌ فشل إرسال التنبيه:", error.message);
  }
}

/**
 * 🗂️ أرشفة السجل في مجلد حسب uid وتاريخ اليوم
 * @param {Object} log
 */
function archiveLog(log) {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
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
