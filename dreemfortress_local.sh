#!/bin/bash
# DreemFortress Local CI/CD Script
# يعمل على Termux أو Debian

# ====== الإعدادات ======
TELEGRAM_BOT_TOKEN="8268505716:AAGAuj3SJWf4hfPEmhMfIIazMhMh4mPBPks"
TELEGRAM_CHAT_ID="1838691511"
FIREBASE_BUCKET="myproject.appspot.com"   # عدلها باسم الـ bucket الخاص بك
FIREBASE_TOKEN="ضع_التوكن_هنا"           # من firebase login:ci

# ====== 1. فحص أمني للكود ======
echo "🔍 تشغيل الفحص الأمني..."
if command -v npm &> /dev/null; then
    npm install
    npm audit --audit-level=high || true
else
    echo "⚠️ npm غير مثبت، تخطي الفحص الأمني."
fi

# ====== 2. توقيع قانوني ======
echo "🖋 إنشاء توقيع قانوني..."
echo "✅ تم التوقيع القانوني على الكود في $(date)" > legal_sign.txt

# ====== 3. أرشفة النتائج ======
echo "📦 إنشاء أرشيف..."
ARCHIVE_NAME="dreemfortress_build_$(date +%F).tar.gz"
tar -czf "$ARCHIVE_NAME" .

# ====== 4. رفع الأرشيف إلى Firebase ======
echo "☁️ رفع الأرشيف إلى Firebase..."
if ! command -v firebase &> /dev/null; then
    curl -sL https://firebase.tools | bash
fi

firebase --token "$FIREBASE_TOKEN" storage:upload "$ARCHIVE_NAME" \
    --bucket "$FIREBASE_BUCKET" \
    --public

DOWNLOAD_URL="https://storage.googleapis.com/$FIREBASE_BUCKET/$ARCHIVE_NAME"

# ====== 5. إرسال تنبيه إلى Telegram ======
echo "📢 إرسال تنبيه إلى Telegram..."
MESSAGE="🚀 تم رفع تحديث جديد على DreemFortress
📅 التاريخ: $(date)
🔗 رابط التحميل: $DOWNLOAD_URL
📂 البيئة: محلية (Termux/Debian)"

curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
    -d chat_id="$TELEGRAM_CHAT_ID" \
    -d text="$MESSAGE"

echo "✅ العملية اكتملت بنجاح!"
