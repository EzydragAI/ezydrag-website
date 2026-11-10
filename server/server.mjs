// Ezydrag: static site + /api/ask (Ask Ezydrag chatbot). Zero dependencies, Node 18+.
// The API key lives only here (env var), never in the browser.
//
// Token budget per LLM call ≈ 150 (instructions) + ≤ 700 (top-4 retrieved chunks) + ~30 (question) in,
// ≤ 160 out. No web search or tools are ever enabled, and questions that don't match the knowledge base
// never reach the model at all.
import "./env.mjs";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ask } from "./ask-core.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const PORT = +process.env.PORT || 8000;
const KEY = process.env.ANTHROPIC_API_KEY || "";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";

// ---------- http ----------
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".webmanifest": "application/manifest+json", ".ico": "image/x-icon" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/ask") {
    if (req.method !== "POST") { res.writeHead(405).end(); return; }
    let raw = "";
    for await (const ch of req) { raw += ch; if (raw.length > 4000) { res.writeHead(413).end(); return; } }
    let body; try { body = JSON.parse(raw); } catch { res.writeHead(400).end(); return; }
    const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress || "?";
    const out = await ask(body, ip);
    res.writeHead(out.status, { "content-type": "application/json", "cache-control": "no-store" }).end(JSON.stringify(out.json));
    return;
  }
  let p = decodeURIComponent(url.pathname);
  if (p.endsWith("/")) p += "index.html";
  let file = path.join(DIST, p);
  if (!file.startsWith(DIST + path.sep)) { res.writeHead(403).end(); return; }
  if (!path.extname(file) && fs.existsSync(file + ".html")) file += ".html";
  fs.readFile(file, (err, data) => {
    if (err) {
      fs.readFile(path.join(DIST, "404.html"), (_, d) => res.writeHead(404, { "content-type": TYPES[".html"] }).end(d || "Not found"));
      return;
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(data);
  });
}).listen(PORT, () => console.log(`Ezydrag on http://localhost:${PORT}  ·  Ask Ezydrag LLM: ${KEY ? "ON (" + MODEL + ")" : "OFF (no ANTHROPIC_API_KEY, approved answers only)"}`));
