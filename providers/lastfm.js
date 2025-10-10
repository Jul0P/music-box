const fetch = require('node-fetch');

async function getTopTracks({ limit = 10, period = '4w' }) {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USER;

  if (!apiKey || !username) {
    throw new Error('LASTFM_API_KEY and LASTFM_USER required');
  }

  const periodMap = {
    '7d': '7day',
    '4w': '1month',
    '6m': '6month',
    '1y': '12month',
  };

  const lfmPeriod = periodMap[period] || '1month';

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${apiKey}&period=${lfmPeriod}&limit=${limit}&format=json`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw new Error(`Last.fm API error: ${data.message}`);
  }

  const tracks = Array.isArray(data.toptracks.track) ? data.toptracks.track : [data.toptracks.track];

  return tracks.map((track) => ({
    title: track.name,
    artist: track.artist.name,
    plays: track.playcount,
  }));
}

async function getRecentTracks({ limit = 10 }) {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USER;

  if (!apiKey || !username) {
    throw new Error('LASTFM_API_KEY and LASTFM_USER required');
  }

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&limit=${limit}&format=json`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw new Error(`Last.fm API error: ${data.message}`);
  }

  const tracks = Array.isArray(data.recenttracks.track) ? data.recenttracks.track : [data.recenttracks.track];

  return tracks.map((track) => ({
    title: track.name,
    artist: track.artist['#text'] || track.artist.name,
    album: track.album['#text'] || '',
  }));
}

module.exports = { getTopTracks, getRecentTracks };
