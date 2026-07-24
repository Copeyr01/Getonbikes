# Upshift — Design System

Near-wireframe UI: grayscale only, square corners, flat surfaces, minimal decoration — functionality is the whole point, not a visual language. This supersedes an earlier "functional-first" pass that still used a single orange accent and rounded corners; that pass is itself now one step short of what was asked for, so the system below removes colour and rounding entirely. Two earlier bold explorations ("Night Ride" — black/blue poster system, and a cut-corner "sharp/premium" system) remain paused. See Archived directions.

**Status:** applied site-wide. Every page (`index.html`, school profiles, licence guide, `list-your-school.html`, legal pages) runs on the one shared stylesheet, `css/style.css`.

## Brand
- **Name:** Upshift (working domain: upshiftuk.com)
- **Wordmark:** "Upshift", plain text — no colour accent on any letter.
- **Positioning:** currently piloting in Edinburgh; built to extend UK-wide. Real schools, real reviews, no spin.

---

## Colour tokens

Grayscale only — no colour accent anywhere in the UI.

| Token | Hex | Usage |
|---|---|---|
| `--text` | `#0A0A0A` | Headlines, primary text, primary button fill, borders |
| `--text-2` | `#454545` | Body copy |
| `--text-3` | `#767676` | Meta text, captions, fine print, hero eyebrow |
| `--white` | `#FFFFFF` | Page/card surfaces |
| `--off` | `#F4F4F4` | Section backgrounds, hover state for cards/rows |
| `--border` / `--border-hover` | `#0A0A0A` | Card/input borders — same value; hover feedback comes from a background tint, not a border-colour change |
| `--navy` | `#0A0A0A` | Footer background, placeholder image tiles (name kept for minimal diff; value is now plain black) |
| `--orange` / `--orange-dark` / `--orange-light` | `#0A0A0A` / `#333333` / `#F0F0F0` | Legacy token names kept so old inline styles (`color:var(--orange)` on contact links etc.) still resolve — now just dark/light grays, not a colour accent |
| `--green` / `--green-light` | `#0A0A0A` / `#F0F0F0` | Same story — kept for the same reason, resolves to grayscale |

No element gets a colour treatment other elements don't. Licence badges, which previously colour-coded by licence type, are now plain white boxes with a black border and black text — wayfinding is by label text only.

---

## Typography

System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`) — no webfonts to load, no third-party font CDN calls to disclose in the Cookie policy.

- Headings: 700–800 weight, sentence case (never all-caps outside of `.text-label` eyebrows).
- Body: 400 weight, 1.65 line-height for readability.
- `.text-label`: 700 weight, uppercase, letter-spaced — reserved for eyebrows/section labels, not body copy.

---

## Shape language

Square corners, flat surfaces, everywhere:
- **Buttons, search bars, badges, tags, pills:** `border-radius: 0` (all `--radius-*` tokens are `0`).
- **Cards (listing cards, licence cards, content cards):** `1px` solid black border, white fill, square corners.
- **Shadows:** none (`--shadow-sm` / `--shadow-md` / `--shadow-hover` are all `none`). Hover feedback on cards/rows comes from a plain background tint (`--off`) instead.
- **No gradients.** Placeholder image tiles (school initials) are a flat black fill, not the earlier navy gradient.

---

## Components

### Nav
Sticky white bar, plain-text wordmark, a school-search box, quiet text links (licence guides / regions / reviews) — no "List your school" CTA here. It was removed from the persistent nav (visible on every pageview, for every rider) since the site is riders-first and schools are onboarded via outreach, not a self-serve funnel; it remains, once, in the footer's Company column.

**Mobile (≤700px):** a traditional icon-based nav rather than just hiding things — the inline search box and text links are replaced by two square icon buttons (magnifying glass, hamburger), each revealing its full content as a dropdown panel anchored under the nav bar. Built with a pure-CSS checkbox-toggle pattern (hidden `<input type="checkbox">` + `<label>` icon buttons + `:checked ~` sibling selectors) rather than JavaScript, so it works identically on every page without needing a script tag added to each one — this is a plain static multi-page site with no shared JS include.

### Hero
White background, gray eyebrow label, plain heading + subtitle, then the primary action — two underlined text links (not boxed tabs, so they read as quiet mode-switches rather than competing with the actual form fields below them) above a search control, both on one row:
- **"Search by Licence"** (default): a licence **dropdown** (All licences / CBT / A1 / A2 / Full A — a `<select>`, not buttons, so it reads as a required-looking form field rather than a set of filter chips) + an optional postcode field + one "Find schools" submit, all inline on a single row (wrapping on narrow screens). Postcode is optional — licence alone filters the list below; adding a postcode also sorts it nearest-first and shows a distance line per card. An inline error appears under the row for anything that doesn't look like a UK postcode, rather than silently failing.
- **"Search by School"**: a single name-search input with a live results dropdown, for the minority of visitors who already know which school they want. Demoted relative to the licence mode since most visitors don't yet know which school they're looking for — that's the problem the site exists to solve.

Both modes filter/sort the same "Edinburgh training schools" list below rather than rendering a separate results view. The top-nav search box is a shortcut into "Search by School."

### Licence chip / card row
Four cards (CBT / A1 / A2 / Full A — not five), each a plain outlined licence-code box + short description + school count, linking into the licence guide. A note beneath the grid explains that Mod 1 & 2 isn't a fifth licence — it's the shared two-part practical test for A1/A2/Full A — and links to that explainer instead of presenting it as a peer option.

### Listing cards
White rows, square corners, 1px black border. Flat black placeholder image tile (initials) left, school name, then a bold price line, then a short description + plain licence badges + tags, honest "No reviews yet" tag rather than a fabricated rating. A live distance line appears once a postcode search has resolved ("2.3 mi away" / "Distance unavailable" for schools without a confirmed postcode — never a guessed figure). Hover tints the row background, no shadow.

**Pricing:** stored per school, per licence (`data-price-cbt`, `data-price-a2`, `data-price-full-a`, etc.) since one school's CBT and Full A courses cost different amounts. Cards show "Prices from £X" (the lowest figure across whatever that school offers) by default, switching to the exact price for the specific licence once "Search by Licence" is used with one selected. **These are placeholder figures, not real prices** — deliberately made to look like normal numbers (no "estimated" label) since the site is password-gated pre-launch; task #9 covers getting real pricing from each school before the gate comes off.

### Footer
Black panel, 4-column grid: wordmark + one-line description, then Licences / Company / Legal link columns, copyright bar beneath.

---

## Layout

- Page container: `1160px` max-width, `padding: 0 24px`.
- Licence grid: `repeat(auto-fill, minmax(155px, 1fr))`, `gap: 10px`.
- Listings: single column, `gap: 12px`.
- Footer grid: `repeat(4, 1fr)`, `gap: 32px` (collapses to 2 cols, then 1, on smaller screens).

---

## Tone of voice

- Direct, plain English — no jargon, no poster-headline copy.
- Leads with speed/ease of finding training, not platform ethics — "rankings are never for sale" is a Terms-of-Use footnote, not headline marketing, since sponsored placements are a planned future revenue stream.

---

## Key decisions

- **Wireframe-level simplicity.** No colour accent anywhere, square corners throughout, no shadows, no gradients — functionality (search, filters, real listings) is the entire visual language for now.
- **Legacy token names kept, values changed.** Rather than touch every inline `style="color:var(--orange)"` across school/legal pages, the `--orange`/`--green` tokens were repointed to grayscale values instead of renamed — same effect, smaller diff.
- **No fake ratings, no fake distances.** A school with zero reviews says so plainly. A school without a confirmed postcode shows "Distance unavailable" rather than an invented number.
- **Rebrand:** GetOnBikes → Upshift. All visible brand text, wordmarks, and contact email updated; the live site still deploys from `getonbikes.vercel.app` (domain migration is separate infrastructure work, not yet done).
- **Licence, not licence-plus-test, is the pickable unit.** CBT, A1, A2 and Full A are real, separate licence categories. Mod 1 & 2 is the practical test shared by A1/A2/Full A, not a fifth parallel licence — so it's a note/tag, not a peer filter option, in both the hero picker and the homepage licence-info grid. `licence-guide.html`'s own top-of-page anchor row still lists it as a 5th jump-link, since that's in-page navigation to a section that genuinely exists there, not a claim of peer status — worth revisiting for consistency later.
- **Guided search over freeform.** The homepage's single combined text box (name/postcode/licence keyword all mixed) was replaced by two explicit modes — pick a licence (+ optional postcode) or search a school by name — since most visitors don't know a school name yet and shouldn't have to guess the right free-text syntax to get a useful result.

---

## Archived directions

Not deleted — parked in case revisited later:
- **"Night Ride"** — black canvas, poster-scale Unbounded type, light-blue accent, fully rounded pill shapes. Was briefly live on the homepage only (`css/homepage.css`, now removed) before the functional-first pass superseded it. Self-hosted Unbounded/Space Grotesk `.woff2` fonts were removed along with it.
- **Cut-corner "sharp/premium"** — warm paper background, single cut-corner clip-path on filled surfaces, orange accent. Retired before Night Ride was built; never implemented in code.
- **First functional-first pass** — same layout as today, but kept a single orange accent colour and rounded corners (12–16px, pill buttons). Superseded by this wireframe pass within the same day.

## Open items

- Real photography/logo assets still don't exist — all imagery is placeholder flat-black tiles with initials.
- Task #9 (verify Edinburgh school data + outreach, now including real pricing) is deferred until closer to launch.
- If a more distinctive visual language is wanted later, it should be layered back on top of this wireframe once core flows (reviews, accounts, more cities) are built and proven — not before.
- **Revisit link colour once real brand colour lands.** Body-copy links currently use `text-decoration: underline` as their only affordance (`a[style*="var(--orange)"] { text-decoration: underline; }`) because this pass is black/white only and `--orange` is temporarily just `--text`'s value. Once a real accent colour is introduced, decide whether links go back to colour-only, keep colour *and* underline, or something else — don't just silently drop the underline without deciding that's actually wanted.

## UX audit fixes (accessibility pass)

Four sitewide fixes from a full UX audit, applied via the shared stylesheet + a scripted pass over every page rather than one-off edits:
- **Link affordance:** body-copy links (inline `style="color:var(--orange)"`) were computed to be *darker* than surrounding body text with no underline — completely indistinguishable from bold non-clickable labels like "Schools that teach it, cheapest first:". Fixed with the underline rule above (monochrome-compliant, no colour used).
- **Focus indicators:** `.hero-search`/`.navbar-search` inputs had `outline: none` with no replacement, and the existing `.navbar-search:focus-within` border-colour rule was already a no-op (border was already at max-contrast black at rest). Replaced with an `outline` on the container at focus-within, offset outside the existing border so it's actually visible.
- **Form labels:** postcode and school-search inputs had no `<label>` at all (placeholder-only); added visually-hidden (`.sr-only`) labels. Nav search input (present on every page) got an `aria-label` instead, since it lacks a stable `id` on most pages.
- **`<main>` landmark + skip link:** neither existed anywhere. Added `<main id="main-content">` wrapping page content on every page, and a `.skip-link` as the first focusable element in `<body>`.

Remaining audit finding: mobile menu not auto-closing on same-page anchor clicks — not yet actioned. Three of the other four (URL-reflected filters, imprecise postcode-error messaging, no loading state during geocode) are resolved by the schools.html PLP — see below. **Correction:** the "Reviews" nav link was previously marked resolved by the PLP too, but that wasn't accurate — only its *destination* changed (from `index.html#top-schools` to `schools.html`), the label itself still said "Reviews" while pointing at a school list with zero actual reviews. Properly fixed in the e-commerce-heuristics pass below by renaming it to "Schools".

## E-commerce/NNG heuristics pass

A full pass comparing every page against Nielsen Norman Group e-commerce/product-discovery heuristics (price transparency, consistency, match between system and real world, recognition over recall). Findings and fixes:

- **Price shown inconsistently across three pages for the same school** (the top finding): the homepage teaser showed no price (deliberate), `schools.html` showed exact prices, and school profile pages showed *no price at all*, just "Course pricing changes — confirm current prices directly with the school." That disclaimer predates the `SCHOOLS` data model — when it was written, prices weren't structured data yet, so hedging made sense; it no longer does. Fixed: `Schools.renderCoursePrices(schoolId)` (`js/schools.js`) fills `[data-course-price][data-licence]` placeholders in each profile page's "Courses offered" section from the same `SCHOOLS` data the PLP already shows prices from — including "Price on request" for a licence with no fixed published price (Two Wheels' A1), never a wrong fallback number. The disclaimer was softened to "Prices are provided by the school and can change — confirm the exact cost when you book," honest without implying total uncertainty now that real numbers are shown.
- **Nav "Reviews" link renamed to "Schools"** sitewide (13 files) — see correction above. `>Reviews</a>` only matched the nav link via its `schools.html` href attribute in the replace, so the unrelated "Reviews" `<h2>` section heading on each profile page was correctly left alone.
- **Licence guide had no path into the PLP.** Each licence section (`#cbt`/`#a1`/`#a2`/`#full-a`) listed individual schools by name but never linked to a pre-filtered view of all of them — a missing "see all in this category" pattern, cheap to add since the PLP's query-param contract already exists. Added a "See all {licence} schools →" button at the end of each section's school list, linking to `schools.html?city=edinburgh&licence={licence}`. Mod 1 & 2 has no CTA — it isn't a licence with its own PLP filter (existing copy already explains this).
- **`mailto:` CTAs are a single point of failure** on Contact and List-your-school — they silently do nothing for anyone without a configured desktop mail client (increasingly common: webmail users, work devices). The address was already visible as the button's own label text, which softens it, but isn't easily copyable. Added a "Copy email address" secondary button next to each mailto CTA, using the Clipboard API with a brief "Copied!" confirmation — a real reliability fallback that needs no backend, consistent with this being a static site.

Lower-priority findings from the same pass, kept as backlog rather than actioned now: no side-by-side "compare schools" feature (worth it once there are more schools per licence); real photography still absent (already tracked above); no map embed on profile pages, just a "Get directions" link out; no name/face attached to "who's behind it" in About; `--text-3` grey (`#767676`) computes to ~4.55:1 contrast on white — passes WCAG AA for body text but with essentially no margin, worth confirming with a contrast tool before it's used against anything slightly off-white.

### Scroll-target offset

The `.navbar` is `position: sticky; top: 0; height: 64px`, so any in-page anchor jump (native `#fragment` link, or JS `scrollIntoView()`) landed with the target heading tucked underneath the nav bar. Fixed with `scroll-margin-top: 80px` on every element that's ever a scroll/anchor target: `#top-schools` (homepage), `#cbt`/`#a1`/`#a2`/`#full-a`/`#mod-1-2` (licence guide), and `#main-content` (skip link). One property covers both native anchor navigation and JS `scrollIntoView()`, since both respect `scroll-margin-top` in all modern browsers — no separate JS offset calculation needed.

## Schools listing page (PLP) + centralized data model

Search used to happen in place on the homepage: submitting either search form re-filtered the `#top-schools` section and scrolled to it. That gave no clear signal a search had happened, no URL state (not bookmarkable/shareable, back button did nothing useful), and didn't scale — "more UK cities" is an explicit stated goal (see Brand section, and the About page), and school data was hardcoded as HTML attributes directly on homepage `.listing-card` elements. Removing Saltire and adding A1/A2 to two schools (see below) required coordinated edits across the homepage markup, `sitemap.xml`, and `licence-guide.html`'s hand-written lists — three files in lockstep, per change.

**Fixed with three pieces:**
- **`js/schools-data.js`** — `window.SCHOOLS`, a single array of plain school objects (id, name, city, area, postcode, licences, per-licence prices, description, tags, profile href). Single source of truth for both the homepage teaser and the PLP. `city` is a first-class field from day one (always `'edinburgh'` today) so a second city later is a data addition, not a restructure.
- **`js/schools.js`** — `window.Schools`, one namespace (not loose globals, to avoid colliding with each page's own inline helpers) wrapping geocoding, distance, pricing, filtering, sorting and card-rendering logic, ported from the old inline homepage script and retargeted from DOM elements to `SCHOOLS` objects. Loaded on both `index.html` and `schools.html`.
- **`schools.html`** (new, root-level, alongside `index.html` — not under `pages/` since that's static content, and not `pages/schools.html` since that collides conceptually with the existing `pages/schools/` profile-page directory) — the canonical browse/filter/search page. A single combinable filter bar (licence + postcode + school-name + sort, AND-combinable rather than the homepage's old mutually-exclusive tab modes), a live result count, removable filter chips, a loading indicator during the postcode geocode fetch, and an empty state with a clear-filters action.

**URL is the source of truth on the PLP**: query params `city`, `licence`, `postcode`, `q`, `sort` (`Schools.toQueryString`/`parseQueryString` centralize the param contract so the two pages can't drift). On load, the PLP parses the URL and renders immediately. On every filter change it updates the URL via `history.replaceState` — deliberately not `pushState` per change, since that would make the back button step through every keystroke; the back button should take you out of the PLP entirely, which normal navigation *into* the PLP already gives for free.

**Postcode error messaging fixed as a side effect of the split**: the homepage only does the synchronous regex check (`Schools.isPostcodeLike`) before navigating — a malformed postcode shows an inline error and never navigates. `schools.html` does the actual geocode once loaded, and only shows "couldn't find that postcode" if the regex passed but the API returned nothing. Two distinct messages for two distinct failure modes.

**Homepage (`index.html`) is lighter now**: hero, both search forms, and the licence quiz stay exactly as they were visually, but on submit they navigate to `schools.html?...` instead of filtering in place. `#top-schools` is now a generic, non-interactive showcase (name/area/licence-badges/link only — no price, no distance — rendered via `Schools.renderTeaser`), plus a "See all Edinburgh schools →" CTA to `schools.html`. Hero stats and the licence-grid per-licence counts are computed from `SCHOOLS` instead of hand-typed, so they can't go stale the way the school-count text did after every past data change.

**PLP listing cards also carry a "Visit website" CTA** straight to the school's own site (the outbound clicks task #19 wants to eventually measure). `renderListingCard` had to change shape for this: it's a `<div>` now, not an `<a>`, since the CTA needs its own real link and an `<a>` can't contain another `<a>`. The card title is a real link to the profile page, "Visit website" a real outbound link (`target="_blank"`), and a click listener on the card navigates to the profile page for clicks anywhere else (checking `e.target.closest('a')` first) — so the whole-card-clickable feel is kept without nesting anchors. The homepage teaser (`renderTeaser`) is untouched and stays a plain `<a>` — it's still non-interactive by design, no CTA needed there.

**Two Wheels now has real pricing**, sourced from their own CBT and DAS brochures (the other two schools' prices remain placeholders — task #9): CBT is £265 (2-day New Rider course), and £990 covers the DAS (Direct Access Scheme) course for *either* the A2 or Category A (Full A) Mod 1 & 2 test route — same course structure, different bike category. A1 training is offered but only "by arrangement," with no fixed published price, so `js/schools-data.js` deliberately omits an `a1` key from Two Wheels' `prices` rather than inventing a number — `priceLabel()` now returns "price on request" for a licence a school teaches but hasn't priced, instead of falling back to a different licence's figure (which would misrepresent it), and `sortSchools()`'s price sort treats an unpriced school as sorting last rather than crashing. `pages/licence-guide.html`'s per-licence lists were re-sorted and re-worded to match (Two Wheels dropped out of the A1 list into the "by arrangement, ask directly" note alongside Edinburgh Motorcycle Training's).

**Explicitly out of scope, flagged as follow-ups, not built now**: migrating `licence-guide.html`'s hand-written per-licence prose lists to also pull from `SCHOOLS` (that page is guide content, not an app view — worth doing once there's real drift-risk, not before); a "compare schools" feature; pagination (irrelevant at 3 schools); an actual city-switcher UI (data model and URL already support `city`, no UI needed until city #2 exists).

## School data corrections (ongoing)

- **Saltire Motorcycle Training removed entirely** (profile page, homepage card, sitemap, all "taught by" mentions and school-count text) — appears to no longer be in business. Now 3 Edinburgh schools, not 4.
- **Harley's Rider Training also teaches A1 and A2**, and **Two Wheels also teaches A1** (all confirmed via each school's own site) — added to cards, profile pages (badges + course entries + descriptions), and the licence guide's A1/A2 sections. The A1 section went from "no school explicitly advertises this" to a real price-sorted list of 2 schools; Edinburgh Motorcycle Training still doesn't advertise A1 separately.
- **Outbound click tracking:** GA4/GTM is the direction under consideration, but deliberately deferred — not implemented yet. Needs its own discussion since it has real implications for the Cookie Policy's current "no third-party trackers" claim and would need a cookie-consent mechanism added (GA4 sets cookies, unlike a cookieless tool). Tracked as an open item, not started.
- `pages/licence-guide.html`'s per-licence "taught by" sentence was replaced with an actual price-sorted (cheapest first) list of schools for that licence, reusing the same placeholder price data as the homepage cards — chosen instead of building separate per-licence pages, since with only 2–3 schools per licence today a dedicated page would be thin content that search engines tend to penalise rather than reward. Revisit once there are enough schools per licence to justify a dedicated URL.
- Each school profile page's website link is now a prominent **"Visit website"** primary button (previously a plain text link buried in the Contact card) — outbound clicks to school sites are the metric this project intends to use to prove its traffic-driving effect, so this CTA needed more visual weight than a text link gave it. Actual click **tracking** (an analytics tool or a click-logging redirect) is a separate decision, not yet implemented — see note in Key decisions.

## "Not sure what you need?" licence quiz

Homepage-only, inside the "Search by Licence" panel (`#quiz-wrap`, `#licence-quiz` in `index.html`). Addresses a gap the search box doesn't: a first-time rider often doesn't know CBT/A1/A2/Full A are separate categories, let alone which applies to them, so the manual dropdown assumes knowledge a chunk of visitors don't have.

- **Adaptive, not a fixed multi-step wizard.** Two quick questions (age bracket, what's already held) are enough to give an instant recommendation in most cases. Only the genuinely ambiguous case — age 19–23 with nothing beyond CBT, where A1 vs A2 depends on what bike they actually want — reveals a third question ("what are you hoping to ride?"). This was a deliberate merge of two options discussed (a lightweight 2-question helper vs. a fuller guided quiz): rather than shipping both as separate UI, one flow is fast for the common case and goes deeper only when needed.
- **Recommendation logic** (`recommendLicence()` in `index.html`) encodes current DVSA rules: CBT is a mandatory prerequisite for every route; A1 from 17 (≤125cc, ≤11kW); A2 from 19 (≤35kW/47bhp); Full A via direct access from 24, or via progressive access from A2 after a 2-year hold once 21+. Verified against gov.uk-sourced rules as of July 2026 (direct WebFetch to gov.uk was blocked by sandbox egress; corroborated via WebSearch across multiple independent sources instead — a manual spot-check against gov.uk before launch is worth doing).
- **Flag for later:** DVSA has an open consultation ("Improving moped and motorcycle training, testing and licensing", 7 Jan–11 May 2026) that could change CBT mechanics and progressive-access requirements. No outcome was published as of writing. The quiz footer says "Rules current as of July 2026" and links to gov.uk — this should be revisited if/when that consultation lands.
- **Result reuses existing search, doesn't duplicate it.** "See matching schools" sets `#licence-select` and re-dispatches the existing `licence-form` submit, so the recommendation flows into the same `renderListings()`/pricing/scroll-margin-top machinery the manual dropdown already uses — no second filtering implementation.
- **Monochrome constraint:** selected quiz-option pills invert to black background/white text (no colour used) to show selection state; native radio dots are recoloured via `accent-color` to match (black at rest, white when the pill is inverted) rather than the browser-default blue, consistent with the black/white-only rule from the UX audit pass.
