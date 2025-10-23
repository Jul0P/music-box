# Music Box

A GitHub Action that displays your music listening statistics from various streaming services in a pinned GitHub Gist.

## 🎵 Supported Providers

- **Spotify** (native API)
- **Qobuz** (via Last.fm)
- **Apple Music** (via Last.fm)
- **Amazon Music** (via Last.fm)
- **Deezer** (via Last.fm)
- **YouTube Music** (via Last.fm)
- **Tidal** (via Last.fm)

## 📊 Display Modes

| Mode           | Description        | Compatibility                                         |
| -------------- | ------------------ | ----------------------------------------------------- |
| `title_artist` | Title + Artist     | ✅ All providers, all modes                           |
| `title_plays`  | Title + Play count | ✅ Last.fm top_tracks only (Qobuz, Apple Music, etc.) |
| `title_album`  | Title + Album      | ✅ Spotify (all modes), Last.fm (recent_tracks only)  |

### Display Mode Compatibility Matrix

| Provider             | Mode          | title_artist | title_plays | title_album |
| -------------------- | ------------- | ------------ | ----------- | ----------- |
| **Spotify**          | top_tracks    | ✅           | ❌          | ✅          |
| **Spotify**          | recent_tracks | ✅           | ❌          | ✅          |
| **Last.fm (others)** | top_tracks    | ✅           | ✅          | ❌          |
| **Last.fm (others)** | recent_tracks | ✅           | ❌          | ✅          |

**Note**: When a mode is not available, the display will show empty values or fall back to `title_artist`.

## 🚀 Quick Start

### 1. Create a Gist

- Go to https://gist.github.com
- Create a new **public** gist (or private if you prefer)
- Add any filename and content (will be overwritten)
- Note the **Gist ID** from the URL (e.g., `abc123def456`)

### 2. Get your credentials

#### For Spotify:

1. Go to https://developer.spotify.com/dashboard
2. Create an app
3. Add redirect URI: `https://example.com/callback`
4. Note your **Client ID** and **Client Secret**
5. Use Postman or an online tool to get a **Refresh Token** with these scopes:
   ```
   user-read-private user-read-email user-top-read user-read-recently-played
   ```

#### For Last.fm (Qobuz, Apple Music, etc.):

1. Go to https://www.last.fm/api/account/create
2. Create an API account
3. Note your **API Key**
4. Note your **Last.fm username**
5. **Important**: Enable scrobbling from your music app to Last.fm

### 3. Configure secrets

In your repository: **Settings → Secrets and variables → Actions → New repository secret**

**Required for all:**

- `GH_TOKEN` (automatically provided by GitHub Actions)
- `GIST_ID` (your gist ID)

**For Spotify:**

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

**For other providers (via Last.fm):**

- `LASTFM_API_KEY`
- `LASTFM_USER`

### 4. Customize the workflow (optional)

Edit `.github/workflows/update.yml` to change settings:

**Update frequency (cron):**

```yaml
schedule:
  - cron: '0 0 * * *' # Daily at midnight (default)
  # - cron: '0 */6 * * *'   # Every 6 hours
  # - cron: '0 */12 * * *'  # Every 12 hours
  # - cron: '0 9,18 * * *'  # Twice daily (9 AM & 6 PM UTC)
```

**Provider and display options:**

```yaml
with:
  provider: 'spotify' # spotify, qobuz, apple, amazon, deezer, youtube, tidal
  mode: 'top_tracks' # top_tracks, recent_tracks
  limit: '10' # 1-50
  period: '4w' # 7d, 4w, 6m, 1y
  display_mode: 'title_artist' # title_artist, title_plays, title_album
```

**Note**: Times are in UTC. For your local timezone, adjust accordingly (e.g., 9 AM PST = 5 PM UTC).

## 📝 Configuration Options

### Inputs

| Input          | Description      | Default        | Options                                                             |
| -------------- | ---------------- | -------------- | ------------------------------------------------------------------- |
| `provider`     | Music service    | `spotify`      | `spotify`, `qobuz`, `apple`, `amazon`, `deezer`, `youtube`, `tidal` |
| `mode`         | Type of tracks   | `top_tracks`   | `top_tracks`, `recent_tracks`                                       |
| `limit`        | Number of tracks | `10`           | `1-50`                                                              |
| `period`       | Time range       | `4w`           | `7d`, `4w`, `6m`, `1y`                                              |
| `display_mode` | Display format   | `title_artist` | `title_artist`, `title_plays`, `title_album`                        |

## 🔧 Local Testing

1. Copy `sample.env` to `.env`
2. Fill in your credentials
3. Run: `node index.js`

Example `.env`:

```env
GH_TOKEN=ghp_your_token
GIST_ID=your_gist_id
PROVIDER=spotify
MODE=top_tracks
DISPLAY_MODE=title_artist

# Spotify
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token

# Last.fm
LASTFM_API_KEY=your_api_key
LASTFM_USER=your_username
```

## 📌 Pin your Gist

1. Go to your GitHub profile
2. Click **"Customize your pins"**
3. Select your music gist
4. Save

Your music stats will now appear on your profile! 🎉

## 🛠️ Troubleshooting

### "Insufficient client scope" (Spotify)

- Your refresh token doesn't have the required scopes
- Regenerate it with: `user-top-read` and `user-read-recently-played`

### Empty plays count with Spotify

- Spotify API doesn't provide play counts
- Use `title_artist` instead, or switch to a Last.fm-based provider

### Empty album with Last.fm top_tracks

- Last.fm API limitation - albums not available in top tracks
- Use `recent_tracks` mode or `title_artist` display mode
