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

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GIST_ID = process.env.GIST_ID;

    if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is required');
    if (!GIST_ID) throw new Error('GIST_ID is required');

    core.setSecret(GITHUB_TOKEN);

    const provider = providerCore.getProvider(providerName);
    const displayName = providerCore.getProviderDisplayName(providerName);

    const items = await provider.getTopTracks({ limit, period });

    const formattedData = formatter.formatTracks(displayName, mode, 'title_artist', items, { limit, period });

    await updateGist(GIST_ID, formattedData, GITHUB_TOKEN);

    core.info('Gist updated successfully');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
