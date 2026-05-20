// /functions/api/count.js
// Cloudflare Pages Function — returns total active subscriber count.
// Secrets live in Cloudflare Environment Variables. Safe to commit publicly.

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), { 
      status: 405, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  const PUB_ID = env.BEEHIIV_PUB_ID;
  const API_KEY = env.BEEHIIV_API_KEY;

  if (!PUB_ID || !API_KEY) {
    return new Response(JSON.stringify({ count: 0 }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
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

    return new Response(JSON.stringify({ count }), { 
      status: 200, 
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate'
      } 
    });
  } catch (err) {
    return new Response(JSON.stringify({ count: 0 }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
