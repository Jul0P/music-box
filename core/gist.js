const { Octokit } = require('@octokit/rest');

async function updateGist(gistId, formattedData, token) {
  const octokit = new Octokit({ auth: token });
  const { title, content } = formattedData;

  try {
    const gist = await octokit.gists.get({ gist_id: gistId });
    const filename = Object.keys(gist.data.files)[0];

    await octokit.gists.update({
      gist_id: gistId,
      files: {
        [filename]: {
          filename: title,
          content,
        },
      },
    });
    console.log('✅ Gist updated successfully!');
  } catch (error) {
    console.error(`❌ Unable to update gist: ${error}`);
    throw error;
  }
}

module.exports = { updateGist };
