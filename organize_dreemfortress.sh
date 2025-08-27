#!/data/data/com.termux/files/usr/bin/bash

echo "🧠 بدء تنظيم مشروع DreemFortress..."

# إنشاء مجلدات موحدة
mkdir -p Organized/{Reports,Scripts,Keys,PyCache,Workflows,Docs,Archives}

# تجميع التقارير
mv DreamLogs/*.json Organized/Reports/ 2>/dev/null
mv DreamLogs/*.pdf Organized/Reports/ 2>/dev/null
mv DreamLogs/*.sig Organized/Reports/ 2>/dev/null
mv DreamLogs/test.log Organized/Reports/ 2>/dev/null

# تجميع السكربتات
mv *.py Organized/Scripts/ 2>/dev/null
mv scripts/*.py Organized/Scripts/ 2>/dev/null

# تجميع المفاتيح
mv private.key Organized/Keys/ 2>/dev/null
mv .github/keys/*.key Organized/Keys/ 2>/dev/null

# تجميع ملفات التوثيق
mv legal_sign.txt Organized/Docs/ 2>/dev/null
mv test_ci.md Organized/Docs/ 2>/dev/null

# تجميع ملفات الأرشفة
mv *.tar.gz Organized/Archives/ 2>/dev/null

# تجميع ملفات الـ pycache
mv __pycache__ Organized/PyCache/ 2>/dev/null
mv scripts/__pycache__ Organized/PyCache/ 2>/dev/null

# تجميع ملفات GitHub Actions
mv .github/workflows/*.yml Organized/Workflows/ 2>/dev/null

# حذف الملفات المتكررة (نفس الاسم والمحتوى)
echo "🧹 حذف الملفات المتكررة..."
fdupes -rdN Organized/

echo "✅ تم تنظيم المشروع داخل مجلد Organized/"
