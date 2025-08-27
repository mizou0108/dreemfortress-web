#!/data/data/com.termux/files/usr/bin/bash

echo "🔍 بدء فحص صلاحية ملفات DreemFortress..."

error_found=0

# فحص ملفات Python
echo -e "\n📦 فحص ملفات Python:"
for file in $(find . -name "*.py"); do
    echo "➡️ $file"
    python3 -m py_compile "$file" 2>/dev/null && echo "✅ صالح" || { echo "❌ يحتوي على أخطاء"; error_found=1; }
    grep -qE 'input\(|raw_input\(' "$file" && { echo "⚠️ يحتوي على إدخال يدوي"; error_found=1; } || echo "👌 لا يعتمد على إدخال يدوي"
done

# فحص مفتاح GPG
echo -e "\n🔐 فحص المفتاح:"
if [ -f private.key ]; then
    gpg --list-packets private.key >/dev/null 2>&1 && echo "✅ مفتاح GPG صالح" || { echo "❌ مفتاح GPG تالف"; error_found=1; }
else
    echo "⚠️ ملف private.key غير موجود"
    error_found=1
fi

# فحص التوقيع
echo -e "\n🧾 فحص ملفات التوقيع:"
for sig in DreamLogs/*.sig; do
    json="${sig%.sig}.json"
    if [ -f "$json" ]; then
        gpg --verify "$sig" "$json" >/dev/null 2>&1 && echo "✅ توقيع $sig مطابق لـ $json" || { echo "❌ توقيع $sig غير صالح"; error_found=1; }
    else
        echo "⚠️ الملف المرتبط $json غير موجود"
        error_found=1
    fi
done

# فحص ملفات PDF
echo -e "\n📄 فحص ملفات PDF:"
for pdf in DreamLogs/*.pdf; do
    file "$pdf" | grep -q "PDF" && echo "✅ $pdf ملف PDF صالح" || { echo "❌ $pdf ليس ملف PDF"; error_found=1; }
done

# فحص الملفات الفارغة
echo -e "\n📁 فحص الملفات الفارغة:"
for f in $(find . -type f -size 0); do
    echo "⚠️ ملف فارغ: $f"
    error_found=1
done

# فحص المجلدات الفارغة
echo -e "\n📂 فحص المجلدات الفارغة:"
for dir in DreamLogs scripts .github; do
    [ "$(ls -A $dir)" ] && echo "✅ $dir يحتوي على ملفات" || { echo "⚠️ $dir فارغ"; error_found=1; }
done

# إنهاء التنفيذ إذا وُجد خطأ
if [ "$error_found" -eq 1 ]; then
    echo -e "\n❌ تم اكتشاف أخطاء أو تلف في الملفات. إيقاف التنفيذ."
    exit 1
else
    echo -e "\n✅ الفحص مكتمل بنجاح. جميع الملفات سليمة."
fi
