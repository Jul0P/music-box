const core = require('@actions/core');
const providerCore = require('./core/provider');
const { updateGist } = require('./core/gist');
const formatter = require('./core/formatter');

require('dotenv').config();

async function run() {
  try {
    // Priority: 1. Secrets (env vars), 2. Workflow inputs, 3. Defaults
    const providerName = process.env.PROVIDER || core.getInput('provider') || 'spotify';
    const mode = process.env.MODE || core.getInput('mode') || 'top_tracks';
    const limit = parseInt(process.env.LIMIT || core.getInput('limit') || '10', 10);
    const period = process.env.PERIOD || core.getInput('period') || '4w';
    const displayMode = process.env.DISPLAY_MODE || core.getInput('display_mode') || 'title_artist';

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

    const GH_TOKEN = process.env.GH_TOKEN;
    const GIST_ID = process.env.GIST_ID;

    if (!GH_TOKEN) throw new Error('GH_TOKEN is required as a secret');
    if (!GIST_ID) throw new Error('GIST_ID is required as a secret');

    core.setSecret(GH_TOKEN);

    const provider = providerCore.getProvider(providerName);
    if (!provider) throw new Error(`Provider ${providerName} not supported`);

    const displayName = providerCore.getProviderDisplayName(providerName);

    let items = [];
    if (mode === 'top_tracks') {
      items = await provider.getTopTracks({ limit, period });
    } else if (mode === 'recent_tracks') {
      items = provider.getRecentTracks ? await provider.getRecentTracks({ limit }) : [];
    }

    const formattedData = formatter.formatTracks(displayName, mode, displayMode, items, { limit, period });

    await updateGist(GIST_ID, formattedData, GH_TOKEN);

    core.info('Gist updated successfully');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
