# Claude Cofounder — Waitlist

Static waitlist landing page with a serverless backend that registers subscribers to Beehiiv.

## File structure

```
claudecofounder/
├── index.html          ← the landing page
├── functions/
│   └── api/
│       ├── subscribe.js    ← Cloudflare Pages Function: adds subscriber
│       └── count.js        ← Cloudflare Pages Function: returns count
└── README.md           ← this file
```

**No secrets are stored in this repo.** API keys live only in Cloudflare's Environment Variables.

## Deploy

1. Push this repo to GitHub.
2. Go to the **Cloudflare Dashboard** → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select this repository and begin setup.
4. Before deploying, expand **Environment Variables** (under Settings) and add:
   - `BEEHIIV_API_KEY` = your Beehiiv API key (starts with `key_`)
   - `BEEHIIV_PUB_ID` = your Beehiiv publication ID (starts with `pub_`)
5. Click **Save and Deploy**.

Site goes live at `https://your-project.pages.dev`. Add your custom domain in **Custom Domains**.

## How it works

```
Visitor fills form
     ↓
index.html  →  POST /api/subscribe  →  Beehiiv API
     ↓
Success screen + counter increments
```

The counter on page load calls `/api/count` to fetch the current subscriber total.

## Beehiiv welcome email

Set up under **Automations** in your Beehiiv dashboard — trigger on "User subscribes."
