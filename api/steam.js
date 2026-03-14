// api/steam.js
// Fetches recently played games from Steam (last 2 weeks only)
//
// Required env vars in Vercel:
//   STEAM_API_KEY   ← from https://steamcommunity.com/dev/apikey
//   STEAM_USER_ID   ← your 64-bit Steam ID (find at steamid.io)

const HIDDEN = [1222670];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { STEAM_API_KEY, STEAM_USER_ID } = process.env;

  if (!STEAM_API_KEY || !STEAM_USER_ID) {
    return res.status(500).json({ error: 'Steam env vars not configured' });
  }

  try {
    const recentRes = await fetch(
      `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_USER_ID}&count=10&format=json`
    );
    const recentData = await recentRes.json();
    const games = (recentData?.response?.games || [])
      .filter(g => !HIDDEN.includes(g.appid))
      .slice(0, 6);

    if (games.length === 0) {
      return res.status(200).json({ empty: true });
    }

    return res.status(200).json({
      games: games.map(g => ({
        appid: g.appid,
        name: g.name,
        playtime_2weeks: g.playtime_2weeks || 0,
      })),
    });
  } catch (err) {
    console.error('steam api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
