# AJZ Digital Calling Card

A static site with no build step. Upload this folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, or your own hosting) under a short path like `yourdomain.com/ajz/`.

## Before going live

1. **Set the real URL.** In `index.html`, replace `https://yourdomain.com/ajz/` in the `og:` and `twitter:` meta tags with the real address. Facebook and Messenger only show the preview image when the URL is absolute.
2. **Project photos.** The auto-playing carousel in "What we do" uses `images/work/01.jpg` … `08.jpg` (about 900px, under 150 KB each). To add a photo, copy a slide in `index.html` and change its image, caption and category. Slides with a missing photo are skipped automatically.
3. **Logo.** The logo is `images/logo-ajz.png` (square, for the header) and `images/logo-ajz-wide.png` (for the middle of the QR code). If the logo changes, save it under a **new file name** and bump `CACHE` in `sw.js`, so phones that visited before load the new one instead of a cached copy.
4. **Use HTTPS.** Offline support, clipboard copy and sharing all require it.

## NFC card and QR code

- Write the card URL (for example `https://yourdomain.com/ajz/`) to the NFC tag as a **URI / URL record**. Any NFC writer app works, such as NXP TagWriter or NFC Tools. Phones open it without a special app.
- After deploying, open the live site and tap **Download QR Code** to get a 1200px PNG for printing. The QR code always encodes the URL the page is served from, so open the final domain before downloading.
- The QR code and NFC tag only hold the URL. Changes to the page appear without reprinting the cards.

## Updating later

When you change `index.html`, bump `CACHE` in `sw.js` (for example `ajz-card-v2`) so returning visitors get fresh files. Pages load network-first, so online visitors always see the latest version.
