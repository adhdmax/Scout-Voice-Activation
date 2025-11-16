import WebSocket from "ws";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`🎙️ Scout Voice Activation running on port ${PORT}`);

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    console.log("🗣️ Received:", msg.toString());
    ws.send(`🔊 Scout heard: "${msg.toString()}"`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

