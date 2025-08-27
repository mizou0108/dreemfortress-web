import json, os, requests
from datetime import datetime

LOG_DIR = "DreamLogs"
REPORT_FILE = f"{LOG_DIR}/legal_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

def extract_events(log_path):
    events = []
    with open(log_path, "r") as f:
        for line in f:
            if any(keyword in line for keyword in ["ERROR", "CRITICAL", "MODIFIED"]):
                events.append({
                    "timestamp": datetime.now().isoformat(),
                    "line": line.strip()
                })
    return events

def send_telegram_alert(events):
    if not events:
        print("ℹ️ لا توجد أحداث حساسة.")
        return

    message = f"🚨 تم رصد {len(events)} حدث حساس في السجلات:\n"
    for e in events[:3]:
        message += f"- {e['line']}\n"

    response = requests.post(
        f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
        data={
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message
        }
    )

    if response.ok:
        print("✅ تم إرسال التنبيه إلى Telegram.")
    else:
        print("❌ فشل إرسال التنبيه.")
        print(response.text)

def save_report(events):
    with open(REPORT_FILE, "w") as f:
        json.dump(events, f, indent=2)
    print(f"✅ تم حفظ التقرير في: {REPORT_FILE}")

def main():
    all_events = []
    for filename in os.listdir(LOG_DIR):
        if filename.endswith(".log"):
            path = os.path.join(LOG_DIR, filename)
            all_events += extract_events(path)

    save_report(all_events)
    send_telegram_alert(all_events)

if __name__ == "__main__":
    main()
