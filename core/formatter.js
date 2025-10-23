const eaw = require('eastasianwidth');

function truncate(str, maxLen) {
  if (!str) return '';
  str = String(str).trim();
  if (eaw.length(str) <= maxLen) return str;

  let cut = str.substring(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > Math.floor(maxLen * 0.6)) {
    cut = cut.substring(0, lastSpace);
  }
  return cut.trim() + '…';
}

function padForEastAsian(str, width, padEnd = true) {
  const len = eaw.length(str);
  if (len >= width) return str;
  const diff = width - len;
  if (padEnd) return str + ' '.repeat(diff);
  else return ' '.repeat(diff) + str;
}

function formatTracks(providerName, mode, displayMode, tracks = [], opts = {}) {
  const numTracks = Math.min(opts.limit || 10, tracks.length || 0);
  const lines = [];

  const FIXED_LEFT_WIDTH = 38;
  const FIXED_RIGHT_WIDTH = 20;

  for (let i = 0; i < numTracks; i++) {
    const t = tracks[i] || {};
    const titleRaw = t.title || t.name || '';
    const valueRaw =
      displayMode === 'title_artist'
        ? t.artist || t.artist_name || ''
        : displayMode === 'title_plays'
        ? String(t.plays || t.playcount || '')
        : displayMode === 'title_album'
        ? t.album || t.album_name || ''
        : t.artist || t.artist_name || '';

    const title = truncate(titleRaw, FIXED_LEFT_WIDTH);
    const value = truncate(valueRaw, FIXED_RIGHT_WIDTH);

    const left = padForEastAsian(title, FIXED_LEFT_WIDTH, true);
    const right = padForEastAsian(value, FIXED_RIGHT_WIDTH, false);

    lines.push(left + right);
  }

  const providerLabel = providerName.charAt(0).toUpperCase() + providerName.slice(1);
  const modeLabel = mode === 'top_tracks' ? 'Top Tracks' : 'Recent Tracks';

  const title = `🎵 My ${providerLabel} ${modeLabel}`;

  const content = lines.join('\n');

  return { title, content };
}

module.exports = { formatTracks };
