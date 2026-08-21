import { requireAdmin } from './_auth.js';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.PUBLIC_SITE_ORIGIN || 'https://origen-prime.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!requireAdmin(req, res)) return;

  const syncUrl = process.env.PAIKARI_SYNC_URL;
  const syncSecret = process.env.PAIKARI_SYNC_SECRET;
  if (!syncUrl || !syncSecret) {
    return res.status(503).json({
      error: 'Paikari sync is not configured',
      required: ['PAIKARI_SYNC_URL', 'PAIKARI_SYNC_SECRET'],
    });
  }

  try {
    const response = await fetch(syncUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'x-origen-sync-secret': syncSecret,
      },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status >= 500 ? 502 : response.status).json({
        error: payload.error || 'Paikari catalog sync failed',
      });
    }
    return res.status(200).json(payload);
  } catch (error) {
    console.error('Catalog sync API error:', error);
    return res.status(502).json({ error: 'Unable to reach Paikari catalog sync' });
  }
}
