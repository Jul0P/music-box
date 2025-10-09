const fetch = require('node-fetch');

async function getAccessTokenFromRefresh() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Spotify credentials required: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Spotify auth failed: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

async function getTopTracks({ limit = 10, period = '4w' }) {
  const accessToken = await getAccessTokenFromRefresh();

  const periodMap = {
    '7d': 'short_term',
    '4w': 'short_term',
    '6m': 'medium_term',
    '1y': 'long_term',
  };

  const timeRange = periodMap[period] || 'medium_term';

  const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Spotify API error: ${data.error?.message || 'Unknown error'}`);
  }

  return data.items.map((track) => ({
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    album: track.album.name,
  }));
}

module.exports = { getTopTracks };
