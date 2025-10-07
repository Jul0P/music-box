const fetch = require('node-fetch');

require('dotenv').config();

async function getAccessTokenFromRefresh(clientId, clientSecret, refreshToken) {
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status}`);
  const json = await res.json();
  return json.access_token;
}

async function getTopTracks({ limit = 10, period = '4w' } = {}) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN are required');
  }

  const accessToken = await getAccessTokenFromRefresh(clientId, clientSecret, refreshToken);

  const map = { '7d': 'short_term', '4w': 'short_term', '6m': 'medium_term', '1y': 'long_term' };
  const time_range = map[period] || 'short_term';

  const url = `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${time_range}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });

  if (!res.ok) throw new Error(`Spotify API failed: ${res.status}`);

  const json = await res.json();

  return (json.items || []).map((i) => ({
    title: i.name,
    artist: i.artists.map((a) => a.name).join(', '),
  }));
}

module.exports = { getTopTracks };
