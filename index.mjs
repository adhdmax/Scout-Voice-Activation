import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const PORT = process.env.PORT || 8080;

// Define file paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "public");

// Serve static files first
const server = http.createServer((req, res) => {
  let filePath = path.join(publicPath, req.url === "/" ? "index.html" : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    } else {
      const ext = path.extname(filePath);
      const type = ext === ".html" ? "text/html" :
                   ext === ".js" ? "text/javascript" :
                   "text/plain";
      res.writeHead(200, { "Content-Type": type });
      res.end(data);
    }
  });
});

// Start WebSocket *after* the HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Cli
