// Netlify Function behind POST /api/ask (see netlify.toml). Same brain as server/server.mjs.
// Needs ANTHROPIC_API_KEY in Netlify > Site configuration > Environment variables.
import { ask } from "../../server/ask-core.mjs";

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default async (req, context) => {
  if (req.method !== "POST") return json(405, { error: "method" });
  let body;
  try { body = JSON.parse((await req.text()).slice(0, 4000)); } catch { return json(400, { error: "bad_json" }); }
  const out = await ask(body, context?.ip || req.headers.get("x-nf-client-connection-ip") || "?");
  return json(out.status, out.json);
};
