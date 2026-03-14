// api/books.js
// Scrapes your public Goodreads "currently-reading" shelf
// Set GOODREADS_USER_ID in Vercel environment variables

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const userId = process.env.GOODREADS_USER_ID;
  if (!userId) {
    return res.status(500).json({ error: 'GOODREADS_USER_ID not set' });
  }

  try {
    // Goodreads RSS feed for currently-reading shelf — no API key needed
    const feedUrl = `https://www.goodreads.com/review/list_rss/${userId}?shelf=currently-reading`;

    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; personal-dashboard/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Goodreads returned ${response.status}`);
    }

    const xml = await response.text();

    // Parse the RSS XML
    const titleMatch = xml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    const authorMatch = xml.match(/<author_name><!\[CDATA\[(.*?)\]\]><\/author_name>/);
    const pagesMatch = xml.match(/<num_pages><!\[CDATA\[(\d+)\]\]><\/num_pages>/);

    // user_read_at or user_date_added give progress context
    // Goodreads RSS doesn't expose page number directly, but user_shelves may include percent
    const percentMatch = xml.match(/<user_read_at><!\[CDATA\[(.*?)\]\]><\/user_read_at>/);

    // Try to find book_id for a more targeted scrape if needed
    const bookIdMatch = xml.match(/<book_id>(\d+)<\/book_id>/);

    if (!titleMatch) {
      return res.status(200).json({ error: 'No book found on currently-reading shelf' });
    }

    const title = titleMatch[1].trim();
    const author = authorMatch ? authorMatch[1].trim() : 'Unknown';
    const pages = pagesMatch ? parseInt(pagesMatch[1]) : null;

    // Scrape the actual reading progress from the user's currently-reading shelf page
    // This gives us the page number the user last updated
    let page = null;
    let percent = null;

    try {
      const shelfUrl = `https://www.goodreads.com/review/list/${userId}?shelf=currently-reading&per_page=1`;
      const shelfRes = await fetch(shelfUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; personal-dashboard/1.0)' }
      });
      const html = await shelfRes.text();

      // Look for "page X of Y" or percent in the shelf HTML
      const pageMatch = html.match(/page\s+(\d+)\s+of\s+(\d+)/i);
      if (pageMatch) {
        page = parseInt(pageMatch[1]);
        const totalPages = parseInt(pageMatch[2]);
        percent = Math.round((page / totalPages) * 100);
      } else {
        // Try percent-read pattern
        const pctMatch = html.match(/(\d+)%\s*done/i) || html.match(/data-percent="(\d+)"/);
        if (pctMatch) percent = parseInt(pctMatch[1]);
      }
    } catch (_) {
      // Progress scrape failed — still return the book title
    }

    return res.status(200).json({
      title,
      author,
      pages,
      page,
      percent,
    });
  } catch (err) {
    console.error('books api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
