name: DreemFortress Hybrid CI/CD

on:
  push:
    branches:
      - main

jobs:
  run-hybrid:
    runs-on: ubuntu-latest
    steps:
      - name: 📥 سحب الكود
        uses: actions/checkout@v4

      - name: 🛠 تشغيل السكريبت
        run: bash dreemfortress_hybrid.sh
        env:
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
          FIREBASE_BUCKET: ${{ secrets.FIREBASE_BUCKET }}
          FIREBASE_TOKEN_PATH: ${{ secrets.FIREBASE_TOKEN_PATH }}
