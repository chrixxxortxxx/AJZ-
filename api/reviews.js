// Live Google rating + reviews for AJZ, via Places API (New).
// Needs the GOOGLE_PLACES_API_KEY environment variable in Vercel (see README).
// The place is fixed here so the key can't be used to look up anything else.
const PLACE_ID = 'ChIJmavX9bdt-TIRU0ZzeXdjrwc';
const FIELDS = 'rating,userRatingCount,reviews,googleMapsUri';

module.exports = async (req, res) => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ error: 'not_configured' });
  }

  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=en`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS }
    });
    if (!r.ok) {
      console.error('Places API error', r.status, await r.text());
      res.setHeader('Cache-Control', 'public, s-maxage=300');
      return res.status(502).json({ error: 'upstream' });
    }
    const p = await r.json();
    const reviews = (p.reviews || [])
      .map((rv) => ({
        rating: rv.rating,
        text: (rv.text && rv.text.text) || (rv.originalText && rv.originalText.text) || '',
        when: rv.relativePublishTimeDescription || '',
        published: rv.publishTime || '',
        author: (rv.authorAttribution && rv.authorAttribution.displayName) || 'Google user',
        authorUrl: (rv.authorAttribution && rv.authorAttribution.uri) || '',
        reviewUrl: rv.googleMapsUri || ''
      }))
      .filter((rv) => rv.text)
      .sort((a, b) => (b.published || '').localeCompare(a.published || ''));

    // Vercel's CDN keeps this for an hour, so Google is asked at most ~once an hour
    // no matter how many people tap the card.
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({
      rating: p.rating || null,
      count: p.userRatingCount || 0,
      mapsUrl: p.googleMapsUri || '',
      reviews
    });
  } catch (err) {
    console.error('reviews function failed', err);
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(500).json({ error: 'failed' });
  }
};
