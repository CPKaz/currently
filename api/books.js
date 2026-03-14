// api/books.js
// Scrapes your public Goodreads profile for currently-reading progress
// Set GOODREADS_USER_ID in Vercel environment variables

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const userId = process.env.GOODREADS_USER_ID;
  if (!userId) {
    return res.status(500).json({ error: 'GOODREADS_USER_ID not set' });
  }

  try {
    // Scrape the user's public profile page — this has the currently-reading
    // widget with live page progress baked right into the HTML
    const profileUrl = `https://www.goodreads.com/user/show/${userId}`;
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error(`Goodreads returned ${response.status}`);
    }

    const html = await response.text();

    // Extract title from bookTitle link or anchor
    const titleMatch = html.match(/class="bookTitle"[^>]*>([^<]+)<\/a>/) ||
                       html.match(/title="([^"]+)"[^>]*><img[^>]*alt="[^"]*"[^>]*class="[^"]*bookCover/);

    // Extract author
    const authorMatch = html.match(/class="authorName"[^>]*>([^<]+)<\/a>/);

    // Extract page progress — matches: (page 130 of 399)
    const pageMatch = html.match(/\(page\s+(\d+)\s+of\s+(\d+)\)/);

    // Fallback: look for the input value and total in the wtrPrompt
    const inputPageMatch = html.match(/value="(\d+)"\s+pattern="\\d\*"[^>]*>\s*\n?\s*of\s*\n?\s*(\d+)/);

    if (!titleMatch) {
      return res.status(200).json({ error: 'No book found — make sure your Goodreads profile is public and you have a currently-reading book' });
    }

    const title = titleMatch[1].trim();
    const author = authorMatch ? authorMatch[1].trim() : 'Unknown';

    let page = null;
    let pages = null;

    if (pageMatch) {
      page = parseInt(pageMatch[1]);
      pages = parseInt(pageMatch[2]);
    } else if (inputPageMatch) {
      page = parseInt(inputPageMatch[1]);
      pages = parseInt(inputPageMatch[2]);
    }

    const percent = (page && pages) ? Math.round((page / pages) * 100) : null;

    return res.status(200).json({ title, author, page, pages, percent });

  } catch (err) {
    console.error('books api error:', err);
    return res.status(500).json({ error: err.message });
  }
}
