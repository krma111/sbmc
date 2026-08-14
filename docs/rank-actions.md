# Rank Actions: On-Site Work Already Done + What the Owner Must Do

This checklist complements `docs/citation-sheet.md`. On-site content is built; the
remaining levers (listed below) are off-site or require facts only the owner can
verify. Nothing below is fabricated — every item waits for real, verified data.

## Already shipped on-site (Aug 2026)

- City page: `/beauty-parlour-prayagraj` (head term "beauty parlour Prayagraj")
- 6 area pages: `/beauty-parlour-near-{civil-lines,georgetown,katra,allahpur,mumfordganj,dhoomanganj}-prayagraj`
- Hindi page: `/hi` (content-language hi-IN, Noto Devanagari font, Hindi FAQ schema)
- Blog: `/blog` hub + 5 guides (Article + FAQPage schema, dated 2026-08-03)
- Schema: `BeautySalon` now has `areaServed` + `hasOfferCatalog` (all service pages)
- Footer: "Areas We Serve" column, Blog link, "हिंदी में पढ़ें" link
- `sitemap.xml` (33 URLs) and `llms.txt` include every new page

## Owner actions — biggest ranking levers, in priority order

### 1. Google Business Profile (do first — this is the #1 local-pack lever)
- Verify the listing completely: name, category, address, phone, hours, photos.
- Replace the placeholder in `src/content/business.ts` (`MAPS_LINK`, line 6) with
  the verified profile URL once Google shows it. `mapsLink` and
  `reviewRequestLink` use this constant automatically.
- Match NAP exactly: `109/4 Maharshi Dayanand Marg, Front of Jain Hostel, Colonelganj, Prayagraj, UP 211002`, phone `+91 98895 94584`.

### 2. Exact location pin
- Confirm the entrance pin, then set `geo` in `src/content/business.ts` (line 50):
  `geo: { latitude: "25.45xx", longitude: "81.84xx" }` (fill real digits).
- The schema omits `geo` until this is done — no invented coordinates.

### 3. Reviews
- Send the WhatsApp review request (`business.reviewRequestLink`) to every happy
  customer; the in-salon flow at `/review-card` prints the same link.
- Reply to every review on Google (replies are a ranking factor for local pack).
- Do NOT add `aggregateRating` to `src/lib/seo/schema.ts` until real reviews
  exist — Google penalizes fake review markup.

### 4. Special / holiday hours
- Verify against GBP and update `business.hours` if the salon closes on
  festivals or has seasonal hours.

### 5. Instagram cadence
- Post 2–3x weekly on `@mahalaxmi.beauty`; link each post to the relevant
  service page (`/services/...`). Fresh signals help the brand entity.

### 6. Content freshness (keep every 1–2 months)
- Add a new article to `src/content/articles.ts` (copy a published entry, use
  today's date for `datePublished`, add to blog hub automatically via `/blog`).
- Update `lastReviewed` on changed services; bump sitemap dates.

### 7. Collect real customer questions (content source)
- Once a week, note the questions customers actually ask on WhatsApp, phone or
  at the salon (e.g. "what do I need to bring?", "can you do last-minute?").
- Each verified question becomes an FAQ entry on the relevant service page or a
  new blog article. This keeps the site answering what real customers ask —
  never invent questions.

## Off-site explained in plain words

"Off-site" = everything Google uses about the business that is NOT on this
website. The site cannot do these things — only the owner can:

1. **Google Business Profile (GBP)** — the free Google listing with address,
   hours, phone and photos. It is the #1 thing Google reads for "beauty parlour
   near me". Steps: claim it at business.google.com, fill every field, upload
   photos, post updates, reply to reviews.
2. **Google reviews** — reviews written on that listing. More genuine reviews =
   higher local ranking. Send the review link after every happy customer.
3. **Citations / directories** — the same Name, Address, Phone listed on other
   sites (Justdial, Sulekha, Bing Places, maps apps). Matching NAP everywhere
   builds trust.
4. **Search Console** — a free Google tool to submit the sitemap and see how
   Google views the site. Go to search.google.com/search-console, add the
   domain `mahalaxmi.beauty`, and submit `https://mahalaxmi.beauty/sitemap.xml`.

None of these require code — they are owner logins and listings. The site's job
is to be ready (it now is: schema, sitemap, pages), Google's job is to rank
based on these signals.

## Verify after this batch

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\YC COMPUTER\AppData\Local\Temp\opencode\verify-prod.ps1"
```
