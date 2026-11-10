# Ezydrag website

- `dist/` — the finished site. Upload this folder's contents to any static host (Netlify, Vercel, Cloudflare Pages, S3, cPanel). `index.html` is the home page.
- `src/`, `*.py`, `tools/` — the source. Edit pages in `src/pages/`, styles in `src/assets/style.css`, then run `python3 build.py` to regenerate `dist/`. If esbuild is installed (or `ESBUILD=/path/to/esbuild`), the build also minifies CSS and JS in `dist/`; sources stay readable.
- Before launch, set in `build.py`: `SITE_URL` (domain), `SOCIAL["linkedin"]` (real page) and `SOCIAL["whatsapp"]` (number, digits only, to show the WhatsApp button).
- SEO files in `dist/`: `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`.
- Change history: `EZYDRAG_AUDIT_LOG.md`.
