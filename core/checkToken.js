import axios from "axios";

const BOT_TOKEN = "8268505716:AAGAuj3SJWf4hfPEmhMfIIazM";

axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`)
  .then(res => console.log("✅ التوكن صالح:", res.data))
  .catch(err => console.error("❌ التوكن غير صالح:", err.response.data));
