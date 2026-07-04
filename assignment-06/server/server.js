import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Expo } from "expo-server-sdk";

dotenv.config();

const serverPort = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN || undefined,
  useFcmV1: true,
});

const registeredPushTokens = new Set();

function buildPushMessage({ pushToken, title, body, data }) {
  return {
    to: pushToken,
    sound: "default",
    title: title || "Habit Tracker",
    body: body || "You have a nudge waiting.",
    data: data || {},
  };
}

async function sendPushMessagesAsync(pushMessages) {
  const messageChunks = expo.chunkPushNotifications(pushMessages);
  const pushTickets = [];
  for (const messageChunk of messageChunks) {
    const ticketChunk = await expo.sendPushNotificationsAsync(messageChunk);
    pushTickets.push(...ticketChunk);
  }
  return pushTickets;
}

async function pruneUnregisteredTokensFromReceiptsAsync(pushTickets, pushTokensSentTo) {
  const receiptIds = pushTickets.filter((ticket) => ticket.status === "ok" && ticket.id).map((ticket) => ticket.id);
  if (receiptIds.length === 0) return;

  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  for (const receiptIdChunk of receiptIdChunks) {
    const receipts = await expo.getPushNotificationReceiptsAsync(receiptIdChunk);
    for (const [ticketIndex, receiptId] of receiptIds.entries()) {
      const receipt = receipts[receiptId];
      if (receipt?.status === "error" && receipt.details?.error === "DeviceNotRegistered") {
        registeredPushTokens.delete(pushTokensSentTo[ticketIndex]);
      }
    }
  }
}

app.get("/", (_request, response) => {
  response.json({ status: "ok", registeredDeviceCount: registeredPushTokens.size });
});

app.post("/register", (request, response) => {
  const { token } = request.body ?? {};
  if (!Expo.isExpoPushToken(token)) {
    return response.status(400).json({ error: "Invalid or missing Expo push token" });
  }
  registeredPushTokens.add(token);
  return response.json({ success: true, registeredDeviceCount: registeredPushTokens.size });
});

app.post("/unregister", (request, response) => {
  const { token } = request.body ?? {};
  registeredPushTokens.delete(token);
  return response.json({ success: true, registeredDeviceCount: registeredPushTokens.size });
});

app.post("/send-test", async (request, response) => {
  const { token, title, body, data } = request.body ?? {};
  if (!Expo.isExpoPushToken(token)) {
    return response.status(400).json({ error: "Invalid or missing Expo push token" });
  }

  const pushMessage = buildPushMessage({ pushToken: token, title, body, data });
  try {
    const pushTickets = await sendPushMessagesAsync([pushMessage]);
    setTimeout(() => {
      pruneUnregisteredTokensFromReceiptsAsync(pushTickets, [token]).catch(console.error);
    }, 15_000);
    return response.json({ success: true, tickets: pushTickets });
  } catch (error) {
    console.error("Failed to send test push", error);
    return response.status(500).json({ error: "Failed to send test push" });
  }
});

app.post("/send", async (request, response) => {
  const { title, body, data } = request.body ?? {};
  const pushTokensToSendTo = Array.from(registeredPushTokens).filter((pushToken) => Expo.isExpoPushToken(pushToken));
  if (pushTokensToSendTo.length === 0) {
    return response.status(400).json({ error: "No registered devices to send to" });
  }

  const pushMessages = pushTokensToSendTo.map((pushToken) => buildPushMessage({ pushToken, title, body, data }));
  try {
    const pushTickets = await sendPushMessagesAsync(pushMessages);
    setTimeout(() => {
      pruneUnregisteredTokensFromReceiptsAsync(pushTickets, pushTokensToSendTo).catch(console.error);
    }, 15_000);
    return response.json({ success: true, sentCount: pushMessages.length, tickets: pushTickets });
  } catch (error) {
    console.error("Failed to send push notifications", error);
    return response.status(500).json({ error: "Failed to send push notifications" });
  }
});

app.listen(serverPort, () => {
  console.log(`Push backend running on http://localhost:${serverPort}`);
});
