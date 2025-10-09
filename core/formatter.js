const eaw = require('eastasianwidth');

const FIXED_LEFT_WIDTH = 38;
const FIXED_RIGHT_WIDTH = 20;

function getDisplayWidth(str) {
  let width = 0;
  for (const char of str) {
    const w = eaw.eastAsianWidth(char);
    if (w === 'F' || w === 'W') {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

function truncate(str, maxWidth) {
  let width = 0;
  let result = '';

  for (const char of str) {
    const charWidth = eaw.eastAsianWidth(char) === 'F' || eaw.eastAsianWidth(char) === 'W' ? 2 : 1;
    if (width + charWidth > maxWidth) {
      result += '…';
      break;
    }
    width += charWidth;
    result += char;
  }

  return result;
}

function padForEastAsian(str, targetWidth) {
  const currentWidth = getDisplayWidth(str);
  const spacesNeeded = Math.max(0, targetWidth - currentWidth);
  return str + ' '.repeat(spacesNeeded);
}

function formatTracks(displayName, mode, displayMode, items, options) {
  const lines = items.map((item) => {
    const leftText = truncate(item.title || '', FIXED_LEFT_WIDTH);
    const leftPadded = padForEastAsian(leftText, FIXED_LEFT_WIDTH);

    let rightText = '';

    if (displayMode === 'title_artist') {
      rightText = item.artist || '';
    } else if (displayMode === 'title_plays') {
      rightText = item.plays ? `${item.plays} plays` : '';
    } else if (displayMode === 'title_album') {
      rightText = item.album || '';
    }

    const rightTruncated = truncate(rightText, FIXED_RIGHT_WIDTH);

    return leftPadded + rightTruncated;
  });

  const modeLabel = mode === 'top_tracks' ? 'Top Tracks' : 'Recent Tracks';
  const periodLabel = options.period ? ` (${options.period})` : '';
  const title = `🎵 ${displayName} - ${modeLabel}${periodLabel}`;
  const content = lines.join('\n');

  return { title, content };
}

module.exports = { formatTracks };
