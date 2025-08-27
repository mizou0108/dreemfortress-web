#!/data/data/com.termux/files/usr/bin/bash

echo "📦 بدء توليد ملخص مشروع DreemFortress..."

# تحميل المتغيرات من .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "⚠️ ملف .env غير موجود"
    exit 1
fi

REPORT="Organized/project_summary_$(date +%Y%m%d_%H%M%S).md"

echo "# 📁 ملخص مشروع DreemFortress" > "$REPORT"
echo "تم التنظيم بتاريخ: $(date)" >> "$REPORT"
echo "" >> "$REPORT"

for dir in Organized/*; do
    [ -d "$dir" ] || continue
    count=$(find "$dir" -type f | wc -l)
    echo "## 📂 $(basename "$dir") — $count ملف" >> "$REPORT"
    find "$dir" -type f | sed 's/^/- /' >> "$REPORT"
    echo "" >> "$REPORT"
done

echo "✅ تم توليد الملخص: $REPORT"

curl -s -X POST https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage \
  -d chat_id=$TELEGRAM_CHAT_ID \
  -d text="📄 تم تنظيم مشروع DreemFortress بنجاح.\n📝 تم توليد ملخص بصيغة Markdown."

curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendDocument" \
  -F chat_id="$TELEGRAM_CHAT_ID" \
  -F document=@"$REPORT"

echo "🎉 تم إرسال الملخص إلى Telegram بنجاح."
