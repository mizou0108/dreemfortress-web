import { sendTelegramAlert } from "./DreemNotifier.js";

const sessionLog = {
  uid: "test123",
  email: "test@example.com",
  timestamp: new Date().toISOString(),
  status: "verified"
};

sendTelegramAlert(sessionLog);
