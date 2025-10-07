function truncate(str, maxLen) {
  if (!str) return '';
  str = String(str).trim();
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 1).trim() + '…';
}

function formatTracks(providerName, mode, tracks = [], opts = {}) {
  const numTracks = Math.min(opts.limit || 10, tracks.length || 0);
  const lines = [];

  const TITLE_WIDTH = 40;
  const ARTIST_WIDTH = 20;

  for (let i = 0; i < numTracks; i++) {
    const t = tracks[i] || {};
    const title = truncate(t.title || t.name || '', TITLE_WIDTH);
    const artist = truncate(t.artist || '', ARTIST_WIDTH);

    const left = title.padEnd(TITLE_WIDTH);
    const right = artist.padStart(ARTIST_WIDTH);

    lines.push(left + right);
  }

  const modeLabel = 'Top Tracks';
  const titleText = `🎵 My ${providerName} ${modeLabel}`;
  const content = lines.join('\n');

  return { title: titleText, content };
}

module.exports = { formatTracks };
