# currently.

A minimal public dashboard showing what you're reading, running, and playing — fetched live on every page load.

## Project structure

```
currently/
├── src/
│   ├── app.css         ← global styles
│   ├── app.html        ← HTML shell
│   └── routes/
│       ├── +layout.svelte   ← root layout (loads app.css)
│       └── +page.svelte     ← main dashboard page
├── api/
│   ├── books.js        ← scrapes Goodreads RSS
│   ├── strava.js       ← Strava API (runs)
│   └── steam.js        ← Steam API (games)
├── package.json
├── svelte.config.js
├── vercel.json         ← routing + build config
└── README.md
```

---

## Setup

### 1. Deploy to Vercel

```bash
npm i -g vercel
cd currently
vercel
```

Follow the prompts. Your site will be live at `https://your-project.vercel.app`.

---

### 2. Goodreads (reading progress)

Goodreads shut down their API, so we use their public RSS feed + a shelf scrape.

**Steps:**
1. Go to your Goodreads profile → **Edit Profile** → make your profile **public**
2. Go to Settings → make your **currently-reading shelf public**
3. Find your **Goodreads user ID** — it's the number in your profile URL:
   `https://www.goodreads.com/user/show/12345678-yourname` → ID is `12345678`
4. Add to Vercel environment variables:
   ```
   GOODREADS_USER_ID = 12345678
   ```

**Keep Kindle synced:**
On your Kindle: Settings → Reading → Goodreads → connect your Amazon account.
Goodreads will auto-update your progress as you read.

**Note on page numbers:** Goodreads' RSS feed doesn't include page progress directly. The scraper tries to parse it from your shelf page HTML. If it only shows the book title with no progress bar, that's normal — the page number update from Kindle sync sometimes takes a few minutes and may not always be in a scrapeable format. The progress bar will appear whenever the data is available.

---

### 3. Strava (running)

Strava uses OAuth — you need to do a one-time setup to get a refresh token.

**Step 1: Create a Strava app**
1. Go to https://www.strava.com/settings/api
2. Create an app (name/description/website can be anything)
3. Set **Authorization Callback Domain** to `localhost`
4. Note your **Client ID** and **Client Secret**

**Step 2: Get your refresh token (one-time)**

Paste this URL into your browser (replace `YOUR_CLIENT_ID`):
```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=activity:read_all
```

After authorising, you'll be redirected to a URL like:
```
http://localhost/?state=&code=ABCDEF123456&scope=...
```

Copy the `code` value, then run this in your terminal:
```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=ABCDEF123456 \
  -d grant_type=authorization_code
```

The response will include a `refresh_token`. Copy it.

**Step 3: Add to Vercel**
```
STRAVA_CLIENT_ID     = your client id
STRAVA_CLIENT_SECRET = your client secret
STRAVA_REFRESH_TOKEN = the refresh token from above
```

The API function handles token refreshing automatically on each request — the refresh token doesn't expire.

---

### 4. Steam (gaming)

**Steps:**
1. Go to https://steamcommunity.com/dev/apikey
2. Enter any domain name (e.g. `localhost`) and generate a key
3. Make your Steam profile **public** (Steam → Edit Profile → Privacy Settings → Public)
4. Find your **64-bit Steam ID** at https://steamid.io — paste your profile URL
5. Add to Vercel:
   ```
   STEAM_API_KEY = your api key
   STEAM_USER_ID = your 64-bit steam id (e.g. 76561198012345678)
   ```

---

### 5. Set environment variables in Vercel

In your Vercel dashboard → Project → Settings → Environment Variables, add all the keys above. Then redeploy:

```bash
vercel --prod
```

Or just push to your connected Git repo and Vercel deploys automatically.

---

## Development

```bash
npm install
npm run dev    # dev server at http://localhost:5173
npm run build  # output in build/
npm run preview  # preview production build
```

## Customising

- **Change your name/tagline:** Edit the header in `src/routes/+page.svelte`
- **Styles:** Edit `src/app.css` (CSS variables, layout, cards, etc.)
- **Add more activity types** (cycling, swimming): The Strava API returns all sport types — edit the filter in `api/strava.js`
- **Show more games:** Change the `count` param in `api/steam.js`
- **Reorder sections:** Move the section blocks in `src/routes/+page.svelte`

---

## Troubleshooting

**Book shows title but no progress bar**
Goodreads doesn't expose page numbers in their RSS. The scraper tries to extract them from the shelf HTML. If Kindle sync hasn't updated yet, or the format changed, only the title will show. Try manually updating your progress on Goodreads.

**Strava returns "Failed to refresh token"**
The refresh token is correct but scopes may be wrong. Redo step 2 of the Strava setup and make sure you authorise `activity:read_all`.

**Steam shows no recent games**
If you haven't played anything in the last 2 weeks, it falls back to your all-time most played. Make sure your game details are set to **public** in Steam privacy settings.
