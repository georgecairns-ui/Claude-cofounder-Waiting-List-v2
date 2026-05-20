// /functions/api/subscribe.js
// Cloudflare Pages Function — registers a new subscriber to Beehiiv.
// Secrets (BEEHIIV_API_KEY, BEEHIIV_PUB_ID) live in Cloudflare Environment Variables.
// This file is safe to commit publicly — no secrets here.

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch(e) {
    body = {};
  }
  const { email, first_name } = body;

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Invalid email address.' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
  if (!first_name || first_name.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'First name is required.' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  const PUB_ID = env.BEEHIIV_PUB_ID;
  const API_KEY = env.BEEHIIV_API_KEY;

  if (!PUB_ID || !API_KEY) {
    console.error('Missing Beehiiv env vars');
    return new Response(JSON.stringify({ error: 'Server not configured.' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  try {
    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: first_name.trim(),
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: 'waitlist-page',
          utm_medium: 'landing-page',
          utm_campaign: 'launch-waitlist',
        }),
      }
    );

    const data = await beehiivRes.json();

    if (!beehiivRes.ok) {
      console.error('Beehiiv error:', data);
      return new Response(JSON.stringify({ error: 'Subscription failed. Please try again.' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ success: true, id: data?.data?.id ?? null }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error('Server error:', err.message);
    return new Response(JSON.stringify({ error: 'Server error. Please try again.' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
