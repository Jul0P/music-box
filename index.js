const core = require('@actions/core');
const { updateGist } = require('./core/gist');
const formatter = require('./core/formatter');
const spotify = require('./providers/spotify');

require('dotenv').config();

async function run() {
  try {
    const limit = parseInt(core.getInput('limit') || process.env.LIMIT || '10', 10);
    const period = core.getInput('period') || process.env.PERIOD || '4w';

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GIST_ID = process.env.GIST_ID;

    if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is required');
    if (!GIST_ID) throw new Error('GIST_ID is required');

    core.setSecret(GITHUB_TOKEN);

    const items = await spotify.getTopTracks({ limit, period });

    const formattedData = formatter.formatTracks('Spotify', 'top_tracks', items, { limit, period });

    await updateGist(GIST_ID, formattedData, GITHUB_TOKEN);

    core.info('Gist updated successfully');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
