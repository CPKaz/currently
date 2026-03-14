// api/strava.js
// Fetches recent runs from Strava API
//
// Required env vars in Vercel:
//   STRAVA_CLIENT_ID
//   STRAVA_CLIENT_SECRET
//   STRAVA_REFRESH_TOKEN   ← from the one-time OAuth setup (see README)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } = process.env;

  if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
    return res.status(500).json({ error: 'Strava env vars not configured' });
  }

  try {
    // Step 1: Refresh access token (Strava tokens expire after 6 hours)
    const tokenRes = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: STRAVA_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      throw new Error('Failed to refresh Strava token: ' + JSON.stringify(tokenData));
    }

    const accessToken = tokenData.access_token;

    // Step 2: Fetch activity stats (last 4 weeks)
    const fourWeeksAgo = Math.floor(Date.now() / 1000) - (28 * 24 * 60 * 60);

    const activitiesRes = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${fourWeeksAgo}&per_page=30&type=Run`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const activities = await activitiesRes.json();

    if (!Array.isArray(activities)) {
      throw new Error('Unexpected Strava response: ' + JSON.stringify(activities));
    }

    const runs = activities.filter(a => a.type === 'Run' || a.sport_type === 'Run');

    const totalDistance = runs.reduce((s, r) => s + r.distance, 0);
    const totalTime = runs.reduce((s, r) => s + r.moving_time, 0);
    const totalElev = runs.reduce((s, r) => s + r.total_elevation_gain, 0);
    const avgPace = totalDistance > 0 ? (totalTime / (totalDistance / 1000)) : 0;

    // Format recent runs for display
    const recent = runs.slice(0, 5).map(r => ({
      name: r.name,
      distance: r.distance,
      moving_time: r.moving_time,
      // average_speed from Strava is m/s — convert to pace (s/km)
      average_speed_pace: r.average_speed > 0 ? 1000 / r.average_speed : 0,
      total_elevation_gain: r.total_elevation_gain,
      start_date_local_ts: Math.floor(new Date(r.start_date_local).getTime() / 1000),
    }));

    return res.status(200).json({
      totals: {
        count: runs.length,
        distance: totalDistance,
        moving_time: totalTime,
        elevation: totalElev,
        avg_pace: avgPace,
      },
      recent,
    });
  } catch (err) {
    console.error('strava api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
