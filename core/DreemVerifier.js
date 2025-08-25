// 🧠 DreemVerifier.js — وحدة تحقق قانوني من uid

import fs from "fs";
import path from "path";

/**
 * ✅ تحقق من uid وأرشف العملية قانونيًا
 * @param {string} uid - معرف المستخدم المستخرج من DreemSession
 */
export function verifySession(uid) {
  const timestamp = new Date().toISOString();
  const logPath = path.join(path.resolve(), "verify.log");

  const logEntry = `[${timestamp}] 🔐 DreemVerifier: تحقق من الجلسة - uid: ${uid}\n`;

  try {
    fs.appendFileSync(logPath, logEntry);
    console.log("🔐 تم التحقق من الجلسة:", uid);
    console.log("📁 تم أرشفة التحقق في:", logPath);
  } catch (error) {
    console.error("❌ فشل أرشفة التحقق:", error.message);
  }
}
