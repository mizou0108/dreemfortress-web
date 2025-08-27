import os, json, hashlib, requests, subprocess
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

# إعدادات عامة
LOG_DIR = "DreamLogs"
UID = os.getenv("DREEM_UID", "anonymous")
TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# استخراج الأحداث الحساسة
def extract_events():
    events = []
    for filename in os.listdir(LOG_DIR):
        if filename.endswith(".log"):
            with open(os.path.join(LOG_DIR, filename), "r") as f:
                for line in f:
                    if any(k in line for k in ["ERROR", "CRITICAL", "MODIFIED"]):
                        events.append({
                            "timestamp": datetime.now().isoformat(),
                            "source": filename,
                            "line": line.strip()
                        })
    return events

# توقيع التقرير باستخدام GPG
def sign_report_gpg(report_path):
    sig_path = f"{report_path}.sig"
    try:
        subprocess.run([
            "gpg", "--output", sig_path,
            "--detach-sign", "--local-user", UID, report_path
        ], check=True)
        print(f"🔐 تم توقيع التقرير: {sig_path}")
        return sig_path
    except subprocess.CalledProcessError:
        print("❌ فشل توقيع التقرير باستخدام GPG.")
        return None

# توليد نسخة PDF من التقرير
def generate_pdf(report_path):
    pdf_path = report_path.replace(".json", ".pdf")
    c = canvas.Canvas(pdf_path, pagesize=A4)
    c.setFont("Helvetica", 10)
    y = 800
    with open(report_path, "r") as f:
        for line in f:
            if y < 50:
                c.showPage()
                y = 800
            c.drawString(40, y, line.strip())
            y -= 15
    c.save()
    print(f"📄 تم توليد نسخة PDF: {pdf_path}")
    return pdf_path

# إرسال تنبيه إلى Telegram
def send_telegram_alert(events, report_path, pdf_path, sig_path):
    if not events:
        print("ℹ️ لا توجد أحداث حساسة.")
        return
    message = f"""🚨 DreemFortress Guardian Alert
📌 عدد الأحداث: {len(events)}
🧾 التقرير: {os.path.basename(report_path)}
📄 PDF: {os.path.basename(pdf_path)}
🔐 التوقيع: {os.path.basename(sig_path) if sig_path else '❌ غير متوفر'}
👤 المستخدم: {UID}
📅 التاريخ: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
    requests.post(f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage", data={
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message
    })
    print("📤 تم إرسال التنبيه إلى Telegram.")

# حفظ التقرير
def save_report(events):
    report_path = f"{LOG_DIR}/legal_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_path, "w") as f:
        json.dump(events, f, indent=2)
    print(f"✅ تم حفظ التقرير في: {report_path}")
    return report_path

# التشغيل
def main():
    events = extract_events()
    report_path = save_report(events)
    sig_path = sign_report_gpg(report_path)
    pdf_path = generate_pdf(report_path)
    send_telegram_alert(events, report_path, pdf_path, sig_path)

if __name__ == "__main__":
    main()
