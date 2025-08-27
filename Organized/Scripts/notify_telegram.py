import os
import requests
from datetime import datetime

# ====== إعدادات البوت ======
TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8268505716:AAGAuj3SJWf4hfPEmhMfIIazMhMh4mPBPks")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "1838691511")

# ====== الرسالة ======
timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
message = f"""
🚀 تنبيه من DreemFortress
📅 التاريخ: {timestamp}
📂 البيئة: محلية (Termux/Debian)
✅ البوت يعمل بنجاح وتم إرسال التنبيه.
"""

# ====== إرسال الرسالة ======
response = requests.post(
    f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
    data={
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message
    }
)

# ====== طباعة النتيجة ======
if response.ok:
    print("✅ تم إرسال التنبيه بنجاح إلى Telegram.")
else:
    print("❌ فشل إرسال التنبيه.")
    print("📤 استجابة Telegram:")
    print(response.text)
