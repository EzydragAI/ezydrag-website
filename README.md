# EzyDrag website

Complete current static website source. No npm installation or build step is needed.

## Run locally

From the extracted ezydrag directory:

    python -m http.server 8000 --directory dist

Open http://localhost:8000 in your browser. On Windows, use `py` instead of `python` if needed.
You can also open dist/index.html directly, although a local server is recommended.

## Files

- dist/index.html: content, navigation, quote builder, terminal UI, FAQs and EzyBiz.
- dist/style.css: responsive styles, branding, motion and reduced-motion support.
- dist/app.js: all interactions, terminal simulation, quote preparation and downloads.
- dist/social-config.js: social profile URLs and WhatsApp configuration.
- dist/ezydrag-nav.svg: supplied top navigation logo.
- dist/brand.svg: original EzyDrag mark used by EzyBiz and the favicon.
- dist/ezydrag-full.png: full footer wordmark.
- .openai/hosting.json: current Sites project identity and static output directory.

## Editing

Edit HTML for content, CSS for appearance and app.js for interactions.
The terminal is a local simulation with sample data. It runs five sequential stages
in about 25 seconds (20 timed beats at 1,250 ms each). Pause, resume, step, reset,
replay and supported typed commands are included. It does not access live systems.

## Social and WhatsApp links

Fill in verified HTTPS profile URLs in dist/social-config.js. For WhatsApp, enter
the international phone number including country code. Unconfigured links remain
hidden. Do not include a leading zero from a domestic phone format.

## Quote/contact behaviour

The visitor reviews the brief and selects Send brief. This opens their email app
with a populated draft; they complete the send there. There is no submission
backend, stored lead database or automatic email delivery. Downloads create a local
text file. hello@ezydrag.in is provisional and must be confirmed before public use.
To change it, replace the address in both dist/index.html and dist/app.js.
EzyBiz uses preset guidance, not a live AI model.

## Hosting

Deploy the contents of dist to any static web host. The existing Sites identity is
preserved in .openai/hosting.json for updates to the current site. For a new independent
Sites project, do not reuse the existing project_id. No credentials are included.

All current site source and assets are included. Git history and temporary deployment
archives are excluded. LinkedIn artwork was delivered separately.
