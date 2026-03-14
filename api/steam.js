// api/steam.js
// Fetches recently played games from Steam
//
// Required env vars in Vercel:
//   STEAM_API_KEY   ← from https://steamcommunity.com/dev/apikey
//   STEAM_USER_ID   ← your 64-bit Steam ID (find at steamid.io)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { STEAM_API_KEY, STEAM_USER_ID } = process.env;

  if (!STEAM_API_KEY || !STEAM_USER_ID) {
    return res.status(500).json({ error: 'Steam env vars not configured' });
  }

  try {
    // GetRecentlyPlayedGames — last 2 weeks
    const recentRes = await fetch(
      `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_USER_ID}&count=6&format=json`
    );
    const recentData = await recentRes.json();
    const recentGames = recentData?.response?.games || [];

    // If no recent games, fall back to all-time most played
    let games = recentGames;
    if (games.length === 0) {
      const allRes = await fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_USER_ID}&include_appinfo=true&format=json`
      );
      const allData = await allRes.json();
      const allGames = allData?.response?.games || [];
      games = allGames
        .sort((a, b) => b.playtime_forever - a.playtime_forever)
        .slice(0, 6)
        .map(g => ({ ...g, playtime_2weeks: 0 }));
    }

    return res.status(200).json({
      games: games.map(g => ({
        appid: g.appid,
        name: g.name,
        playtime_forever: g.playtime_forever, // minutes
        playtime_2weeks: g.playtime_2weeks || 0, // minutes
      })),
    });
  } catch (err) {
    console.error('steam api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
