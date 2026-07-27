# Upshift — Design System (v2: "Carwow-style")

**This is a design-direction test, on branch `claude/design-v2-carwow`, not yet merged.** It replaces the monochrome wireframe pass (v1 — grayscale, square corners, no accent) with a real visual system: single light-blue accent, Space Grotesk throughout, rounded-but-not-pill shapes. No features/functionality changed — same search, same PLP filters, same licence quiz, same school data; this is a re-skin only. See Archived directions for v1's full spec, parked in case this test isn't adopted.

**Status:** applied site-wide via the same shared stylesheet, `css/style.css` — every page (`index.html`, `schools.html`, school profiles, licence guide, legal pages) already referenced its colours/radii/font as CSS custom properties, so this pass changed token *values* rather than rewriting each page. The one exception is the footer, which flips from dark to light and needed its hardcoded inline `color:#fff` overrides removed sitewide (13 files).

## Brand
- **Name:** Upshift (working domain: upshiftuk.com)
- **Wordmark:** "Upshift", plain text — no colour accent on any letter.
- **Positioning:** currently piloting in Edinburgh; built to extend UK-wide. Real schools, real reviews, no spin.

---

## Colour tokens

Single accent (light blue) + ink/line/surface neutrals. Token *names* are kept from v1 (`--orange`, `--text`, `--border`, `--off`, `--navy` etc.) even though they now carry a different semantic system — every page already references these names via `var()`, so re-skinning is a values-only change in `:root`, zero HTML touched for colour.

| Token (v1 name) | = design-system role | Hex | Usage |
|---|---|---|---|
| `--orange` | accent | `#1C7ED6` | Wordmark "Up" (`.accent`), CTA button fills, star ratings, licence-guide codes — reserved for one element/word at a time, never whole paragraphs |
| `--orange-dark` | accent-hover | `#135A9E` | Link/accent hover state |
| `--text` | ink | `#12203D` | Headlines, primary text, wordmark "shift" |
| `--text-2` | ink-soft | `#4A5568` | Nav links, body copy (the workhorse grey — used almost everywhere body text isn't a headline) |
| `--text-3` | ink-mute | `#8A93A0` | Meta text, placeholders, fine print, hero eyebrow, footer links |
| `--text-4` (new) | ink-faint | `#5B6472` | Hero subtitle only, so far — the one component the source doc calls out as a distinct tier from body copy |
| `--white` | — | `#FFFFFF` | Page/card surfaces |
| `--off` | surface-alt | `#F4F6F8` | Search bar fill, section backgrounds, hover tint |
| `--border` / `--border-hover` | line | `#E7EAEE` / `#C9D0D9` | Card/input borders, footer top divider |
| `--navy` | footer bg | `#FFFFFF` | Footer is now light, not dark — name kept for minimal diff |
| `--green` / `--green-light` | — | `#1C7ED6` / `#E8F2FC` | Ratings/distance-away text reuse the single accent rather than a separate success colour — the system only defines one accent |

**Licence badges stay neutral** (plain white/outlined, no colour-per-licence coding) — the source doc is explicit about this for the licence chip row, and it's extended here to the small inline CBT/A1/A2/Full A badges too, for consistency.

**The wordmark's `.accent` span was already in every page's markup** (`<span class="accent">Up</span>`) with no matching CSS rule — it silently rendered as plain ink since v1 had nothing to give it. Added `.accent { color: var(--orange); }` and it's now live everywhere with zero markup changes.

**Inline body links no longer need a forced underline.** v1 added `a[style*="var(--orange)"] { text-decoration: underline; }` because the monochrome pass had no colour to distinguish a link from bold text — that rule's own comment flagged "revisit ... once real brand colour lands." Now that `--orange` is a real accent colour, colour alone is a standard, sufficient differentiator; the underline moved to `:hover` only, as a secondary non-colour signal.

---

## Typography

**Space Grotesk**, self-hosted at `assets/fonts/space-grotesk-latin.woff2` — one variable-weight file (400–700) covers everything, headings and body alike, with the system stack as fallback (`--font-stack`). Self-hosted rather than linked to Google's CDN: this project already tried self-hosting this exact family once before (see Archived directions — "Night Ride" used self-hosted Space Grotesk/Unbounded, removed when that direction was retired) and a live Google Fonts `<link>` would be a third-party request sitting awkwardly next to the Cookie Policy's "no third-party trackers" claim.

**Space Grotesk tops out at weight 700** — it doesn't ship an 800 cut. Wherever the source doc specifies 800 (step numerals, licence-guide codes — neither of which exist as built components yet, see Components below), 700 is used instead.

- Headings: 700 weight, sentence case (never all-caps outside `.text-label` eyebrows) — same rule as v1, just a different typeface.
- Body: 400 weight, 1.65 line-height for readability.
- `.text-label`: 700 weight, uppercase, letter-spaced — eyebrows/section labels only.

---

## Shape language

Rounded, but not pill-shaped for buttons/search — flat throughout, borders (not shadows) do the separation work:
- **Buttons + search bars:** `border-radius: var(--radius-btn)` = `8px` — "rounded rectangle," a new token split out from `--radius-pill` specifically because the source doc puts buttons/search at a different radius than small chip badges.
- **Cards, content cards, dropdowns:** `10–12px` (`--radius-lg` / `--radius-xl`).
- **Small chip/tag badges** (licence badges, tags, region pills, the tiny overlay labels on listing-card images): kept as a true pill (`--radius-pill` = `999px`) — the source doc doesn't cover these specifically, and a 10px radius reads as barely-rounded on an element that's only ~24px tall, so full pill was the more natural read for "same design guidelines, applied to something the doc doesn't mention."
- **Shadows:** still none (`--shadow-*` all `none`) — unchanged from v1, borders do all the separation work in this system too.
- **No gradients.** Placeholder image tiles (school initials) are a flat ink-navy fill.

---

## Components

### Nav
Sticky white bar, wordmark now with "Up" in accent blue (`.accent`, see Colour tokens), text links (Licence guides / Schools) in ink-soft. **Two things the source doc specifies that aren't here, deliberately:**
- **No "Log in" link.** There's no accounts/auth system on this site — adding one would be a dead link, and this pass is design-only, not a licence to add unbuilt features.
- **No "List your school" pill button in the nav.** This was deliberately removed earlier (explicit product decision — riders-first framing, schools onboarded via outreach not a self-serve funnel), not a styling call this redesign should quietly reverse. It stays in the footer's Company column, same as before.

**Mobile (≤700px):** a traditional icon-based nav rather than just hiding things — the inline search box and text links are replaced by two square icon buttons (magnifying glass, hamburger), each revealing its full content as a dropdown panel anchored under the nav bar. Built with a pure-CSS checkbox-toggle pattern (hidden `<input type="checkbox">` + `<label>` icon buttons + `:checked ~` sibling selectors) rather than JavaScript, so it works identically on every page without needing a script tag added to each one — this is a plain static multi-page site with no shared JS include.

### Hero
**Full-bleed banner, new** (superseding the earlier two-column `hero__grid` split from the same design pass): a single large photo panel (`assets/images/hero-rider.webp`, `object-fit: cover`), `20px`-rounded on desktop, edge-to-edge and square on mobile, with a dark scrim gradient for text legibility. White heading + subtitle sit over the image's left side; a floating white search card (`.hero-banner__search`, `320px` wide, `24px` padding — matching `.content-card`'s padding rather than inventing a one-off value) sits right after the text with a tight `40px` gap, not pinned to the banner's far edge. The section's own top padding was dropped to `0` so the banner sits flush under the navbar. Below the banner, a plain stats line (`Now live in Edinburgh — 3 Edinburgh schools listed, 4 licence types covered, 0 reviews so far`) replaces the old on-image eyebrow. Modelled directly on a reference screenshot the user supplied (a travel-booking hero: big photo, contained floating search widget with tabs) — not the source `Design__Carwowstyle.md` doc, which only specified the two-column version this replaces.

`.hero-banner__search` is a real flex child of `.hero-banner` now (not an absolutely-positioned sibling floating over it) — simpler to reason about, and it's what makes the tight text-to-card gap a single `gap` value instead of magic-number positioning. The card keeps the real functionality unchanged, just restyled to fit a narrower, vertically-stacked context (small uppercase field labels — "Licence" / "Postcode" / "School name" — added above each control; fields stack in a column rather than a row):
- **"Search by Licence"** (default): a licence **dropdown** + an optional postcode field + one accent-filled "Find schools" submit.
- **"Search by School"**: a single name-search input with a live results dropdown.

Kept as our own two functional tabs rather than relabelled to the source doc's generic "Find a school / List my school / Read reviews" — that's template copy for a tab set we don't have; restyling the real tabs (colour/shape/type) is the design-only remit here, not relabelling them to match a hypothetical feature set.

**Tabs, restyled:** no longer underlined text links — each tab is `flex:1`, split evenly. Went through two fill treatments before landing here: first a solid `--off` grey fill on the inactive tab for separation, which read as too heavy once live ("grey boxes" — not what was wanted); now both tabs are transparent/text-only at rest, and only the *active* tab gets a white fill with a border (`1px solid var(--border)` on three sides, rounded top corners at `var(--radius-xl)` matching the card) plus a white bottom border sitting exactly on the tab row's own `1px` divider line, so it reads as a raised chip attached to the panel below rather than a filled box. Same fix as before still applies: no `overflow:hidden` on the card, since that also clips the school-search results dropdown extending below it.

**Fields, de-greyed:** the Licence dropdown and Postcode input used the sitewide `.hero-search` grey (`--off`) fill — inside this card specifically that read as another grey box, so `.hero-banner__search .hero-search` overrides it to white, scoped so the same fields elsewhere (the `schools.html` filter bar, `style-guide.html`) keep their normal fill untouched.

**Quiz callout:** "Not sure what you need?" used to be a plain underlined text link below the search row — now a full bordered/tinted callout card (accent border, light-blue fill, 🤔 icon, bold title + one-line description + an accent "Take the quiz →" CTA that flips to "Hide the quiz ↑" when open), directly below the banner where the search used to sit above it. Same click target, same JS toggle logic — only the closed-state markup changed (the toggle handler used to blow away the button's `textContent` on click, which would have destroyed this richer markup; it now only updates the CTA span's text).

**Mobile (≤860px):** `.hero-banner` switches to a column flex layout (text, then card, `16px` gap) instead of a row — the same flex-based structure as desktop, just re-oriented, rather than a separate absolute-positioning scheme. The photo still bleeds edge-to-edge (`width: 100vw` via negative margins, corners square). Height is no longer a fixed min-height; it's driven by content, which naturally keeps text and card close together instead of leaving a large empty photo gap between them. (Two earlier iterations of this: one had the card detach into a plain block below the image entirely; the next tried a fixed `620px` min-height with the card absolutely bottom-anchored, which reintroduced the big gap this was meant to solve, plus an unrelated bug — an `overflow-x:hidden` safety-net on the wrapping element was silently clipping the full-bleed trick itself, so the "edge-to-edge" photo wasn't actually reaching the edges despite the CSS looking correct. Removing that rule and moving to a real flex layout fixed both at once.) The scrim switches from the desktop left-to-right gradient to a top-to-bottom one, since the heading now sits above a full-width card instead of a photo's clearer half.

### Licence chip / card row
Four cards (CBT / A1 / A2 / Full A — not five), each a plain outlined licence-code box + short description + school count, linking into the licence guide. Neutral — no colour-per-licence coding, per the source doc's explicit instruction for this component.

### Listing cards
White rows, `10–12px` rounded corners, `1px` line border. Flat ink-navy placeholder image tile (initials) left, school name, then a bold price line, then a short description + neutral licence badges + tags, honest "No reviews yet" tag rather than a fabricated rating. Restyled colours/shape only — the underlying data-driven rendering (`js/schools.js`'s `renderListingCard`/`renderTeaser`, reading from `js/schools-data.js`) is untouched.

**Pricing is real now**, not placeholder (task #9, completed separately from this design pass) — see "School data corrections" below for where each school's numbers came from.

**Not built: the source doc's "trending course cards" (photo slot) or "trust/reviews grid" (star ratings, quotes, "1,140+ verified reviews").** No real photography exists yet (task #12, open), and there are zero real reviews on this site — fabricating either would contradict the honesty principle this project has held to everywhere else ("No reviews yet" is said plainly, repeatedly, on purpose). These are documented here as patterns to build once real photography/reviews exist, not built now.

### Footer
**Light now, not dark** — white background, `--ink-mute` links, `1px` line top border, 4-column grid (wordmark + one-line description, then Licences / Company / Legal link columns), copyright bar beneath. Required removing hardcoded `color:#fff` inline overrides (wordmark, column headers) and a hardcoded `rgba(255,255,255,0.15)` divider from all 13 pages, since the footer used to be a genuinely dark panel, not just a token-value swap.

---

## Layout

- Page container: `1160px` max-width, `padding: 0 24px` — kept from v1 rather than the source doc's `1440px`/`40px` spec. Widening the whole page is a structural layout change, not a colour/type/shape re-skin, and wasn't part of what this pass scoped or was approved to touch.
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
- **v2 ("Carwow-style") is a design-only pass, tested on a branch.** Given a source doc for a new visual direction, the goal was re-skin, not rebuild: same search/PLP/quiz/data, different colours/type/shape. Concretely this meant *not* adding "Log in" or a nav "List your school" CTA (unbuilt/deliberately-removed features respectively), *not* relabelling the hero's two real tabs to match the doc's generic tab-set template, and *not* fabricating star ratings or reviews to fill the doc's "trust grid" component — see Components above for each.
- **Token values changed, not names, again.** Same reasoning as the v1 rebrand of `--orange`/`--green`: every page already references these custom-property names, so re-skinning is a `:root` values-only edit. Extended this pass to `--border`, `--off`, `--navy` etc. too.
- **Weight 800 → 700.** The source doc calls for weight 800 on step numerals and licence-guide codes; Space Grotesk doesn't ship an 800 cut, so 700 (the heaviest available) is used everywhere the doc says 800.

---

## Archived directions

Not deleted — parked in case revisited later:
- **v1 monochrome wireframe** — grayscale only (`--text`/`--border`/etc. all near-black), square corners (`--radius-*` all `0`), system font stack, dark/black footer. The design system in place immediately before this v2 test; every token/shape/component description above described this until the Carwow-style pass replaced it. Full original spec is preserved in this project's git history (the commit before `claude/design-v2-carwow` branched) if this test isn't adopted and v1 needs restoring exactly.
- **"Night Ride"** — black canvas, poster-scale Unbounded type, light-blue accent, fully rounded pill shapes. Was briefly live on the homepage only (`css/homepage.css`, now removed) before the functional-first pass superseded it. Self-hosted Unbounded/Space Grotesk `.woff2` fonts were removed along with it — notably, the same Space Grotesk family is back, self-hosted again, in v2 above.
- **Cut-corner "sharp/premium"** — warm paper background, single cut-corner clip-path on filled surfaces, orange accent. Retired before Night Ride was built; never implemented in code.
- **First functional-first pass** — same layout as today, but kept a single orange accent colour and rounded corners (12–16px, pill buttons). Superseded by the wireframe pass within the same day.

## Open items

- Real photography/logo assets still don't exist — listing/profile image tiles are still flat-fill initials, not photos. This blocks the source doc's "trending course cards" photo slots and any "trust grid" avatar imagery.
- ~~Task #9 (real per-licence pricing)~~ — done, all three Edinburgh schools have real prices (see "School data corrections" below).
- ~~Revisit link colour once real brand colour lands~~ — done by this v2 pass: colour (`--orange`) is now the differentiator, underline moved to hover-only. See Colour tokens.
- **This branch (`claude/design-v2-carwow`) hasn't been merged.** If it's adopted, fold this file's "v2" framing into the main status line and drop the "test, not yet merged" caveat. If it's rejected, revert to v1 (see Archived directions) rather than leaving the site in a half-migrated state.
- Space Grotesk's weight-800 gap (see Typography) only matters once step-numeral/licence-code components that call for it actually get built — currently a non-issue since neither exists.
- If an even more distinctive visual language is wanted later, it should build on this v2 pass (or v1, if v2 isn't adopted) once core flows (reviews, accounts, more cities) are built and proven — not before.

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

**All three Edinburgh schools now have real pricing — task #9 is done.**
- **Two Wheels**: sourced from their own CBT and DAS brochures. CBT is £265 (2-day New Rider course), and £990 covers the DAS (Direct Access Scheme) course for *either* the A2 or Category A (Full A) Mod 1 & 2 test route — same course structure, different bike category. A1 training is offered but only "by arrangement," with no fixed published price.
- **Harley's Rider Training**: sourced from their own "Training Structure" price sheet. CBT is a flat £199 (weekday full-day course). A1, A2 and Full A (DAS) are priced per lesson — Session/DAS lessons, Mod 1 & 2 practice and test fees are all billed separately, with the number of lessons varying "depending on individual needs and riding abilities" — so there's no honest single package figure to publish; each is unpriced ("price on request") rather than a total assembled from an assumed lesson count.
- **Edinburgh Motorcycle Training**: sourced from their own "Courses and Price List" page (confirmed via a screenshot after web search results gave conflicting figures — one search result had conflated their separate Confidence Riding Course price with CBT). CBT is £195 weekday / £210 weekend. Full A (DAS) is a 4-day or 5-day course at £1,140 or £1,440 respectively (both include the pre-DAS assessment) — the cheaper 4-day figure used as the base. EMT also turned out to teach A1 and A2 (not previously known/listed) — priced hourly (£55/hr for 2 students to an instructor, £75/hr 1-to-1, plus test fees) rather than as a fixed package, so also left unpriced. Added A1/A2 badges, course entries and to their profile page and `licences` array.

Shared logic changes that came out of this: `priceLabel()`/`renderCoursePrices()` return "price on request" for a licence a school teaches but hasn't priced, instead of falling back to a different licence's figure (which would misrepresent it); `sortSchools()`'s price sort treats an unpriced school as sorting last rather than crashing; a `formatPrice()` helper adds a thousands separator (`£1,140`, not `£1140`) now that a price runs into four figures. `pages/licence-guide.html`'s per-licence lists were re-sorted and re-worded throughout to match the new reality that most A1/A2 training across all three schools is unpriced/hourly rather than a fixed package — the A1 section in particular went from naming specific prices to a single paragraph noting all three schools teach it hourly/by-arrangement, since none publish a fixed figure.

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
