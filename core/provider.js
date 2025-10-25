const spotify = require('../providers/spotify');
const lastfm = require('../providers/lastfm');

const LASTFM_PROVIDERS = ['lastfm', 'qobuz', 'apple', 'applemusic', 'amazon', 'amazonmusic', 'deezer', 'youtube', 'youtubemusic', 'tidal'];

function getProvider(name) {
  const normalizedName = (name || '').toLowerCase().replace(/[_\s-]/g, '');

  if (normalizedName === 'spotify') {
    return spotify;
  }

  if (LASTFM_PROVIDERS.includes(normalizedName)) {
    return lastfm;
  }

  return null;
}

function getProviderDisplayName(name) {
  const normalizedName = (name || '').toLowerCase().replace(/[_\s-]/g, '');

  const displayNames = {
    spotify: 'Spotify',
    lastfm: 'Last.fm',
    qobuz: 'Qobuz',
    apple: 'Apple Music',
    applemusic: 'Apple Music',
    amazon: 'Amazon Music',
    amazonmusic: 'Amazon Music',
    deezer: 'Deezer',
    youtube: 'YouTube Music',
    youtubemusic: 'YouTube Music',
    tidal: 'Tidal',
  };

  return displayNames[normalizedName] || name.charAt(0).toUpperCase() + name.slice(1);
}

module.exports = { getProvider, getProviderDisplayName };
