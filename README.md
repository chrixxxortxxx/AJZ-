# AJZ Digital Calling Card

Live at **https://ajz-services.vercel.app/**. It deploys automatically from the `main` branch of `chrixxxortxxx/AJZ-` on GitHub.

It's a static page (`index.html`) plus one small Vercel function (`api/reviews.js`) for live Google reviews. There's no build step.

## Live Google reviews (one-time setup)

The rating, review count and latest reviews update automatically from Google once an API key is added. Until then, the page shows the built-in 4.1 ★ / 10 reviews.

1. Go to <https://console.cloud.google.com/>, create a project (for example "AJZ card") and **add a billing account**. Google requires one, but this site's usage stays inside the monthly free allowance: Vercel asks Google at most about once an hour, roughly 720 times a month.
2. Open **APIs & Services → Library**, search for **Places API (New)** and click **Enable**.
3. Open **APIs & Services → Credentials → Create credentials → API key**. Edit the key and, under **API restrictions**, choose **Restrict key → Places API (New)**. Save.
4. In Vercel, open the project, then **Settings → Environment Variables**. Add `GOOGLE_PLACES_API_KEY` with the key as its value, for **Production** (and Preview if you like).
5. In Vercel, go to **Deployments**, open the ⋯ menu on the latest deployment and choose **Redeploy**.
6. Check it: <https://ajz-services.vercel.app/api/reviews> should return JSON with `rating`, `count` and `reviews`.

Notes:
- Google's API returns up to 5 reviews, chosen by Google. The page shows the 3 newest of them.
- New reviews appear within about an hour.
- The key stays on the server. It never appears in the page, and the function only looks up AJZ's place.

## NFC card and QR code

- Write `https://ajz-services.vercel.app/` to the NFC tag as a **URI / URL record**. Any NFC writer app works, such as NXP TagWriter or NFC Tools. Phones open it without a special app.
- Open the live site and tap **Download QR Code** to get a 1200px PNG with the AJZ logo in the middle. Test-scan the printed version before printing many.
- The QR code and NFC tag only hold the URL. Changes to the page appear without reprinting the cards.

## Updating content

- **Project photos:** the carousel in "What we do" uses `images/work/01.jpg` … `08.jpg` (about 900px, under 150 KB each). To add a photo, copy a slide in `index.html` and change its image, caption and category.
- **Logo:** `images/logo-ajz.png` (square) and `images/logo-ajz-wide.png` (QR centre). If the logo changes, save it under a **new file name** so phones don't keep an old cached copy.
- **After any change,** bump `CACHE` in `sw.js` (for example `ajz-card-v7`). Pages load network-first and `vercel.json` sends `no-cache` for the page, so visitors get updates on their next tap.
