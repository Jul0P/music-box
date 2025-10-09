# Music Box

A GitHub Action that displays your Spotify top tracks in a pinned GitHub Gist.

## 📊 Display Modes

| Mode           | Description        | Compatibility                                        |
| -------------- | ------------------ | ---------------------------------------------------- |
| `title_artist` | Title + Artist     | ✅ All providers, all modes                          |
| `title_plays`  | Title + Play count | ✅ Last.fm top_tracks only                           |
| `title_album`  | Title + Album      | ✅ Spotify (all modes), Last.fm (recent_tracks only) |

**Note**: When a mode is not available, the display will show empty values or fall back to `title_artist`.

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

#### For Last.fm:

1. Go to https://www.last.fm/api/account/create
2. Create an API account
3. Note your **API Key**
4. Note your **Last.fm username**

**For other providers (via Last.fm):**

- `LASTFM_API_KEY`
- `LASTFM_USER`

### 4. The workflow will run automatically

The action is configured in `.github/workflows/update.yml` and runs daily.

## 📝 Configuration

Edit `.github/workflows/update.yml` to customize:

```yaml
with:
  limit: '10' # Number of tracks (1-50)
  period: '4w' # Time range: 7d, 4w, 6m, 1y
```
