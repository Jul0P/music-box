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
- Add any filename and content (it will be replaced automatically by the action)
- After creating the gist, look at the URL in your browser
- The **Gist ID** is the long alphanumeric string at the end of the URL
  - Example: `https://gist.github.com/username/`**`a1b2c3d4e5f6g7h8i9j0`**
  - Your Gist ID would be: `a1b2c3d4e5f6g7h8i9j0`

### 2. Get your credentials

#### For Spotify:

1. **Create a Spotify App:**

   - Go to https://developer.spotify.com/dashboard
   - Click **"Create app"**
   - Fill in:
     - App name: `music-box` (or any name)
     - App description: `GitHub profile music stats`
     - Redirect URI: `http://127.0.0.1:8000/callback`
   - Accept terms and click **"Save"**

2. **Get your credentials:**

   - Copy your **Client ID**
   - Click **"Show Client Secret"** and copy your **Client Secret**

3. **Get a Refresh Token with Postman:**

   **Step 1: Get Authorization Code**

   - Open this URL in your browser (replace `YOUR_CLIENT_ID`):

   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://127.0.0.1:8000/callback&scope=user-read-private%20user-read-email%20user-top-read%20user-read-recently-played
   ```

   - Accept the permissions
   - You'll be redirected to `http://127.0.0.1:8000/callback?code=XXXXX`
   - Copy the **code** from the URL (the `XXXXX` part)

   **Step 2: Exchange Code for Refresh Token in Postman**

   - Open Postman and create a new **POST** request
   - URL: `https://accounts.spotify.com/api/token`
   - Go to **Authorization** tab:
     - Type: `Basic Auth`
     - Username: Your **Client ID**
     - Password: Your **Client Secret**
   - Go to **Body** tab:
     - Select `x-www-form-urlencoded`
     - Add these key-value pairs:
       - `grant_type` = `authorization_code`
       - `code` = `THE_CODE_FROM_STEP_1`
       - `redirect_uri` = `http://127.0.0.1:8000/callback`
   - Click **Send**
   - In the response, copy the **refresh_token** value

#### For Last.fm (Qobuz, Apple Music, Amazon Music, Deezer, YouTube Music, Tidal):

1. Go to https://www.last.fm/api/account/create
2. Create an API account
3. Note your **API Key**
4. Note your **Last.fm username**
5. **Important**: Enable scrobbling from your music app to Last.fm

### 3. Configure secrets

In your repository: **Settings → Secrets and variables → Actions → New repository secret**

**Required for all:**

- `GH_TOKEN` (GitHub Personal Access Token with `gist` permission - [Create one here](https://github.com/settings/tokens/new?scopes=gist&description=music-box-gist))
- `GIST_ID` (your gist ID from [step 1](#1-create-a-gist))

**For Spotify:**

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

**For other providers (via Last.fm):**

- `LASTFM_API_KEY`
- `LASTFM_USER`

**Optional - Override workflow settings via secrets:**

You can override the workflow configuration without editing the file by adding these secrets:

- `PROVIDER` - Override the provider (`spotify`, `qobuz`, `apple`, `amazon`, `deezer`, `youtube`, `tidal` - default: `spotify`)
- `MODE` - Override mode (`top_tracks`, `recent_tracks` - default: `top_tracks`)
- `LIMIT` - Override number of tracks (1-50 - default: `10`)
- `PERIOD` - Override time range (`7d`, `4w`, `6m`, `1y` - default: `4w`)
- `DISPLAY_MODE` - Override display format (`title_artist`, `title_plays`, `title_album` - default: `title_artist`)

**Priority order:** Secrets > Workflow settings > Default values

### 4. Customize the workflow (optional)

Edit `.github/workflows/update.yml` to change settings:

**Update frequency (cron):**

```yaml
schedule:
  - cron: '0 0 * * *' # Daily at midnight (default)
  # - cron: '0 */6 * * *'   # Every 6 hours
  # - cron: '0 */12 * * *'  # Every 12 hours
  # - cron: '0 9,18 * * *'  # Twice daily (9 AM & 6 PM UTC)
  # etc...
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

1. Copy `.env.example` to `.env`
2. Fill in your credentials
3. Run: `npm start` (or `node index.js`)

Example `.env`:

```env
GH_TOKEN=ghp_your_token
GIST_ID=your_gist_id
PROVIDER=spotify
MODE=top_tracks
LIMIT=10
PERIOD=4w
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
