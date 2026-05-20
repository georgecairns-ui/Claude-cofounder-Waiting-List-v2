// /api/count.js
// Vercel Serverless Function — returns total subscriber count.
// Safe to commit publicly — no secrets here.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  // Set CORS headers on every response
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

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
      `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await beehiivRes.json();
    const count =
      data?.meta?.total_results ??
      data?.meta?.total ??
      data?.total_results ??
      data?.total ??
      data?.data?.length ??
      0;

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json({ count });
  } catch (err) {
    return res.status(200).json({ count: 0 });
  }
}
