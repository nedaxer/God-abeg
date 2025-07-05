// server/index.production.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import { createServer } from "http";
var app = express();
var server = createServer(app);
app.use(compression());
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var clientDistPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDistPath));
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});
var port = parseInt(process.env.PORT || "3000", 10);
server.listen(port, () => {
  console.log(`\u2705 Nedaxer production server running on port ${port}`);
});
