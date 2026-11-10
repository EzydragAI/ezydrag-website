/* Site configuration. Fill these before launch. */
window.EZY_CONFIG = {
  bookingUrl: "",          // e.g. "https://calendly.com/ezydrag/demo" — shows "Pick a time" on demo.html
  leadUrl: "",             // POST endpoint for quick-drop emails (HubSpot / Marketo form handler, Formspree…). Empty = opens an email to hello@ezydrag.in
  newsletterUrl: "",       // POST endpoint for Field Notes. Empty = email fallback
  askUrl: "/api/ask",      // Ask Ezydrag LLM endpoint (server/server.mjs). Empty = approved answers only, no LLM
  email:"hello@ezydrag.in",
  nudgeAfterMs: 60000      // the one polite follow-up appears after 60s of reading. Set 0 to turn it off.
};
