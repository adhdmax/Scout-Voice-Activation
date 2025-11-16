import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();
const PORT = process.env.PORT || 8080;

// Resolve file paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "public");

// HTTP server (serves index.html and any static files)
const server = http.createServer((req, res) => {
  const filePath = path.join(publicPath, req.url === "/" ? "index.html" : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const contentType =
        ext === ".html" ? "text/html" :
        ext === ".js" ? "text/javascript" :
        ext === ".css" ? "text/css" :
        "text/plain";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});

// WebSocket setup
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("✅ Client connected");
  ws.send("👋 Hello from Scout!");
  ws.on("message", (msg) => {
    console.log("🗣️ Received:", msg.toString());
    ws.send(`🔊 Scout heard: "${msg.toString()}"`);
  });
  ws.on("close", () => console.log("❌ Client disconnected"));
});

// Start server
server.listen(PORT, () => {
  console.log(`🎙️ Scout Voice Activation ready at http://localhost:${PORT}`);
});

