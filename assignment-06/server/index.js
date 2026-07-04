import cors from "cors";
import "dotenv/config";
import { Expo } from "expo-server-sdk";
import express from "express";

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN || undefined,
  useFcmV1: true,
});

const registeredPushTokens = new Set();
const pendingTicketIdToPushToken = new Map();

app.post("/register", (request, response) => {
  const { token } = request.body ?? {};
  if (!Expo.isExpoPushToken(token)) {
    return response.status(400).json({ error: "Invalid or missing Expo push token" });
  }
  registeredPushTokens.add(token);
  return response.json({ success: true, count: registeredPushTokens.size });
});

app.post("/unregister", (request, response) => {
  const { token } = request.body ?? {};
  registeredPushTokens.delete(token);
  return response.json({ success: true, count: registeredPushTokens.size });
});

app.post("/send", async (request, response) => {
  const { title, body, data } = request.body ?? {};
  if (registeredPushTokens.size === 0) {
    return response.status(400).json({ error: "No registered devices to send to" });
  }

  const messages = [];
  for (const pushToken of registeredPushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) continue;
    messages.push({
      to: pushToken,
      sound: "default",
      title: title || "Hello",
      body: body || "This is a test notification",
      data: data || {},
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  try {
    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }
  } catch (error) {
    console.error("Error sending push notifications:", error);
    return response.status(500).json({ error: "Failed to send notifications" });
  }

  tickets.forEach((ticket, ticketIndex) => {
    if (ticket.status === "ok" && ticket.id) {
      pendingTicketIdToPushToken.set(ticket.id, messages[ticketIndex].to);
    }
  });

  setTimeout(() => pruneInvalidTokensAsync(tickets).catch(console.error), 15_000);

  return response.json({ success: true, sent: messages.length, tickets });
});

async function pruneInvalidTokensAsync(tickets) {
  const receiptIds = tickets.filter((ticket) => ticket.status === "ok" && ticket.id).map((ticket) => ticket.id);
  if (receiptIds.length === 0) return;

  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  for (const receiptIdChunk of receiptIdChunks) {
    const receipts = await expo.getPushNotificationReceiptsAsync(receiptIdChunk);
    for (const [receiptId, receipt] of Object.entries(receipts)) {
      if (receipt.status !== "error") continue;
      console.error(`Receipt ${receiptId} error: ${receipt.message}`);
      if (receipt.details?.error === "DeviceNotRegistered") {
        const staleToken = pendingTicketIdToPushToken.get(receiptId);
        if (staleToken) {
          registeredPushTokens.delete(staleToken);
          console.warn(`Dropped stale token after DeviceNotRegistered: ${staleToken}`);
        }
      }
      pendingTicketIdToPushToken.delete(receiptId);
    }
  }
}

app.get("/", (_request, response) => {
  response.json({ status: "ok", registeredDevices: registeredPushTokens.size });
});

app.listen(PORT, () => {
  console.log(`Push backend running on http://localhost:${PORT}`);
});
