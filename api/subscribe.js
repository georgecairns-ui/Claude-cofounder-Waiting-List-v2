// /api/subscribe.js
// Vercel Serverless Function — registers a new subscriber to Beehiiv.
// Secrets (BEEHIIV_API_KEY, BEEHIIV_PUB_ID) live in Vercel Environment Variables.
// This file is safe to commit publicly — no secrets here.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { email, first_name } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (!first_name || first_name.trim().length === 0) {
    return res.status(400).json({ error: 'First name is required.' });
  }

  const PUB_ID = process.env.BEEHIIV_PUB_ID;
  const API_KEY = process.env.BEEHIIV_API_KEY;

  if (!PUB_ID || !API_KEY) {
    console.error('Missing Beehiiv env vars');
    return res.status(500).json({ error: 'Server not configured.' });
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
      return res.status(500).json({ error: 'Subscription failed. Please try again.' });
    }

    return res.status(200).json({ success: true, id: data?.data?.id ?? null });
  } catch (err) {
    console.error('Server error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
