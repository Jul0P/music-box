const fetch = require('node-fetch');

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

  if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.access_token;
}

async function getTopTracks({ limit = 10, period = '4w' } = {}) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_REFRESH_TOKEN must be set for Spotify provider');
  }

  const accessToken = await getAccessTokenFromRefresh(clientId, clientSecret, refreshToken);

  const map = { '7d': 'short_term', '4w': 'short_term', '6m': 'medium_term', '1y': 'long_term', long_term: 'long_term' };
  const time_range = map[period] || 'short_term';

  const url = `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${time_range}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Spotify getTopTracks failed: ${res.status} ${await res.text()}`);
  const json = await res.json();

  return (json.items || []).map((i) => ({
    title: i.name,
    artist: i.artists.map((a) => a.name).join(', '),
    album: (i.album && i.album.name) || '',
    url: i.external_urls && i.external_urls.spotify,
  }));
}

async function getRecentTracks({ limit = 10 } = {}) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_REFRESH_TOKEN must be set for Spotify provider');
  }

  const accessToken = await getAccessTokenFromRefresh(clientId, clientSecret, refreshToken);

  const url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Spotify getRecentTracks failed: ${res.status} ${await res.text()}`);
  const json = await res.json();

  return (json.items || []).map((item) => ({
    title: item.track.name,
    artist: item.track.artists.map((a) => a.name).join(', '),
    album: (item.track.album && item.track.album.name) || '',
    url: item.track.external_urls && item.track.external_urls.spotify,
    played_at: item.played_at,
  }));
}

module.exports = { getTopTracks, getRecentTracks };
