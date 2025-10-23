# Music Box

A GitHub Action that displays your Spotify top tracks in a pinned GitHub Gist.

## 🚀 Quick Start

### 1. Create a Gist

- Go to https://gist.github.com
- Create a new **public** gist
- Note the **Gist ID** from the URL

### 2. Get Spotify credentials

1. Go to https://developer.spotify.com/dashboard
2. Create an app
3. Note your **Client ID** and **Client Secret**
4. Get a **Refresh Token** with scopes: `user-read-private user-top-read`

### 3. Configure secrets

In your repository: **Settings → Secrets and variables → Actions**

Add these secrets:

- `GITHUB_TOKEN` (automatically provided)
- `GIST_ID`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

### 4. The workflow will run automatically

The action is configured in `.github/workflows/update.yml` and runs daily.

## 📝 Configuration

Edit `.github/workflows/update.yml` to customize:

```yaml
with:
  limit: '10' # Number of tracks (1-50)
  period: '4w' # Time range: 7d, 4w, 6m, 1y
```
