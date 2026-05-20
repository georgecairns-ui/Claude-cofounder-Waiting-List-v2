# Claude Cofounder — Waitlist

Static waitlist landing page with a serverless backend that registers subscribers to Beehiiv.

## File structure

```
claudecofounder/
├── index.html          ← the landing page
├── api/
│   ├── subscribe.js    ← serverless function: adds subscriber to Beehiiv
│   └── count.js        ← serverless function: returns subscriber count
└── README.md           ← this file
```

**No secrets are stored in this repo.** API keys live only in Vercel's Environment Variables.

## Deploy

1. Push this repo to GitHub.
2. Create a free account at https://vercel.com (sign in with GitHub).
3. Click **Add New → Project** → import this repo.
4. Before deploying, expand **Environment Variables** and add:
   - `BEEHIIV_API_KEY` = your Beehiiv API key (starts with `key_`)
   - `BEEHIIV_PUB_ID` = your Beehiiv publication ID (starts with `pub_`)
5. Click **Deploy**.

Site goes live at `https://your-project.vercel.app`. Add your custom domain in **Settings → Domains**.

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
