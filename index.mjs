import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const PORT = process.env.PORT || 8080;

// Serve static files (like index.html)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = http.createServer((req, res) => {
  const filePath =
    req.url === "/" ? path.join(__dirname, "public", "index.html") : path.join(__dirname, req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
});

// WebSocket layer
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (msg) => {
    console.log("🗣️ Received:", msg.toString());
    ws.send(`🔊 Scout heard: "${msg.toString()}"`);
  });
  ws.on("close", () => console.log("Client disconnected"));
});

// Start combined server
server.listen(PORT, () => {
  console.log(`🎙️ Scout Voice Activation ready at http://localhost:${PORT}`);
});
