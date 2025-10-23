const fetch = require('node-fetch');

async function getTopTracks({ limit = 10, period = '4w' } = {}) {
  const apiKey = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USER;
  if (!apiKey || !user) throw new Error('LASTFM_API_KEY and LASTFM_USER must be set for Last.fm provider');

  const map = { '7d': '7day', '4w': '1month', '6m': '6month', '1y': '12month', overall: 'overall' };
  const periodParam = map[period] || '1month';

  const url = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${encodeURIComponent(
    user,
  )}&api_key=${apiKey}&format=json&limit=${limit}&period=${periodParam}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Last.fm getTopTracks failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  const list = (json.toptracks && json.toptracks.track) || [];

  return list.map((t) => ({
    title: t.name,
    artist: (t.artist && t.artist.name) || '',
    plays: t.playcount || '',
    url: t.url || '',
  }));
}

async function getRecentTracks({ limit = 10 } = {}) {
  const apiKey = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USER;
  if (!apiKey || !user) throw new Error('LASTFM_API_KEY and LASTFM_USER must be set for Last.fm provider');

  const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
    user,
  )}&api_key=${apiKey}&format=json&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Last.fm getRecentTracks failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  const list = (json.recenttracks && json.recenttracks.track) || [];

  return list.map((t) => ({
    title: t.name,
    artist: (t.artist && t.artist['#text']) || '',
    album: (t.album && t.album['#text']) || '',
    nowplaying: t['@attr'] && t['@attr'].nowplaying,
  }));
}

module.exports = { getTopTracks, getRecentTracks };
