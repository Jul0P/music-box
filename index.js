const core = require('@actions/core');
const providerCore = require('./core/provider');
const { updateGist } = require('./core/gist');
const formatter = require('./core/formatter');

require('dotenv').config();

async function run() {
  try {
    const providerName = core.getInput('provider') || process.env.PROVIDER || 'spotify';
    const mode = core.getInput('mode') || process.env.MODE || 'top_tracks';
    const limit = parseInt(core.getInput('limit') || process.env.LIMIT || '10', 10);
    const period = core.getInput('period') || process.env.PERIOD || '4w';
    const displayMode = core.getInput('display_mode') || process.env.DISPLAY_MODE || 'title_artist';

    if (!['top_tracks', 'recent_tracks'].includes(mode)) {
      throw new Error(`Invalid mode: ${mode}. Must be 'top_tracks' or 'recent_tracks'`);
    }

    if (limit < 1 || limit > 50) {
      throw new Error(`Invalid limit: ${limit}. Must be between 1 and 50`);
    }

    if (!['7d', '4w', '6m', '1y'].includes(period)) {
      core.warning(`Invalid period: ${period}. Using default '4w'`);
    }

    if (!['title_artist', 'title_plays', 'title_album'].includes(displayMode)) {
      throw new Error(`Invalid display_mode: ${displayMode}. Must be 'title_artist', 'title_plays', or 'title_album'`);
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GIST_ID = process.env.GIST_ID;

    if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is required');
    if (!GIST_ID) throw new Error('GIST_ID is required');

    core.setSecret(GITHUB_TOKEN);

    const provider = providerCore.getProvider(providerName);
    const displayName = providerCore.getProviderDisplayName(providerName);

    let items = [];
    if (mode === 'top_tracks') {
      items = await provider.getTopTracks({ limit, period });
    } else if (mode === 'recent_tracks') {
      if (!provider.getRecentTracks) {
        throw new Error(`Provider ${providerName} does not support recent_tracks`);
      }
      items = await provider.getRecentTracks({ limit });
    }

    const formattedData = formatter.formatTracks(displayName, mode, displayMode, items, { limit, period });

    await updateGist(GIST_ID, formattedData, GITHUB_TOKEN);

    core.info('Gist updated successfully');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
