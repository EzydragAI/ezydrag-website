# White-Label Branding Strategy & Implementation Plan

White-label branding is a business model where you provide the core technology, but your **Distribution Partners** (agencies, consultants, etc.) sell it as their own. The end-client never sees "Ezydrag AI"—they only see your partner's branding.

## 1. Why Implement White-Labeling?

*   **Premium Upsell:** Partners will pay a significantly higher monthly platform fee to remove your branding.
*   **Agency Empowerment:** Agencies can sell your AI agents for $500+/mo while paying you a wholesale rate, making them highly motivated to sell for you.
*   **Partner Retention:** Once an agency has mapped their custom domain and uploaded their logo, they are "locked in" to your ecosystem.

---

## 2. Technical Implementation Steps

### Phase 1: Database Schema Updates
Add the following fields to your `Partners` table:
*   `branding_logo_url`: (String) URL to the partner's hosted logo.
*   `branding_primary_color`: (String) Hex code for UI buttons/accents.
*   `custom_domain`: (String) The domain the partner wants to use (e.g., `agents.acmedigital.com`).
*   `portal_title`: (String) The browser tab title for their clients.

### Phase 2: Domain Masking (CNAME)
To make it look truly professional, partners should not use your URL.
1.  **Partner Action:** Partner creates a CNAME record in their DNS (GoDaddy/Cloudflare):
    *   `agents.partneragency.com` → `portal.ezydrag.ai`
2.  **Your Action:** Use a tool like **Vercel Platforms** or a custom middleware in Next.js to detect the incoming hostname (`request.headers.get('host')`).
3.  **Dynamic Routing:** If the host is not `ezydrag.ai`, look up the partner in the database associated with that host.

### Phase 3: The Dynamic Theme Engine (Frontend)
In your main Agent UI component, fetch the branding config at the root:

```typescript
// Pseudo-code for Branding Injection
const branding = await getPartnerBranding(hostname);

return (
  <div style={{ '--primary-color': branding.color }}>
    <header>
      <img src={branding.logo || '/default-ezydrag-logo.png'} />
      <h1>{branding.title}</h1>
    </header>
    <AgentInterface />
  </div>
);
```

---

## 3. The "Brutal" Success Metrics

*   **Custom Domain Verification:** Automate the process of checking if their CNAME is pointed correctly before allowing them to "Go Live."
*   **Wholesale Credit Management:** Since it's white-labeled, you should never bill their end-clients. You bill the **Partner** in bulk, and the partner bills their clients separately.
*   **Hidden "Powered By":** Offer a "Lite" white-label that keeps a small "Powered by Ezydrag AI" at the bottom, and a "Full" white-label that removes it entirely for an extra fee.

---

## 4. Next Steps
1.  Update the **Settings** page UI to include "Verify Domain" buttons.
2.  Implement a **Middleware** in Next.js to handle multi-tenancy.
3.  Create a **Wholesale Billing** system where partners buy credits upfront.
