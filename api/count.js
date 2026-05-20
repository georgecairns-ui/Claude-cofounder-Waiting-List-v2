// /api/count.js
// Vercel Serverless Function — returns total active subscriber count.
// Secrets live in Vercel Environment Variables. Safe to commit publicly.

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const PUB_ID = process.env.BEEHIIV_PUB_ID;
  const API_KEY = process.env.BEEHIIV_API_KEY;

  if (!PUB_ID || !API_KEY) {
    return res.status(200).json({ count: 0 });
  }

  try {
    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions?limit=1&status=active`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await beehiivRes.json();
    const count = data?.meta?.total ?? 0;

    // Cache for 60 seconds so we don't hammer the Beehiiv API on every page load
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json({ count });
  } catch (err) {
    return res.status(200).json({ count: 0 });
  }
}
