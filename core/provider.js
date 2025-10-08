const spotify = require('../providers/spotify');
const lastfm = require('../providers/lastfm');

function getProvider(providerName) {
  const normalized = providerName.toLowerCase();

  if (normalized === 'spotify') {
    return spotify;
  }

  if (normalized === 'lastfm') {
    return lastfm;
  }

  throw new Error(`Provider ${providerName} not supported`);
}

function getProviderDisplayName(providerName) {
  const names = {
    spotify: 'Spotify',
    lastfm: 'Last.fm',
  };
  return names[providerName.toLowerCase()] || providerName;
}

module.exports = { getProvider, getProviderDisplayName };
