// Shared logic for rendering, filtering, sorting and geocoding schools from
// the SCHOOLS data (js/schools-data.js). Used by both index.html (a
// non-interactive teaser) and schools.html (the full filter/search page),
// so behaviour can't drift between the two. One global namespace rather
// than several loose globals, since both pages already define their own
// page-specific helpers (e.g. norm()) and a bare function name would risk
// silently colliding with them.
window.Schools = (function () {
  var LICENCE_LABELS = { 'cbt': 'CBT', 'a1': 'A1', 'a2': 'A2', 'full-a': 'Full A' };
  var LICENCE_ORDER = ['cbt', 'a1', 'a2', 'full-a'];

  function norm(str) { return (str || '').toLowerCase().trim(); }

  // ------------------------------------------------------------------
  // Postcode distance: geocode via postcodes.io (free, no key, UK-only)
  // and compute straight-line distance client-side. Cached per postcode
  // so repeated searches don't re-fetch. Schools with no confirmed
  // postcode are never geocoded — they show "distance unavailable"
  // rather than a guessed figure.
  // ------------------------------------------------------------------
  var FULL_POSTCODE_RE = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i;
  var OUTCODE_RE = /^[a-z]{1,2}\d[a-z\d]?$/i;
  var geocodeCache = {};

  function isPostcodeLike(q) {
    var t = (q || '').trim();
    return FULL_POSTCODE_RE.test(t) || OUTCODE_RE.test(t);
  }

  function geocode(rawQuery) {
    var q = (rawQuery || '').trim();
    var key = norm(q).replace(/\s+/g, '');
    if (geocodeCache[key]) return Promise.resolve(geocodeCache[key]);

    var isFull = FULL_POSTCODE_RE.test(q);
    var endpoint = isFull
      ? 'https://api.postcodes.io/postcodes/' + encodeURIComponent(q)
      : 'https://api.postcodes.io/outcodes/' + encodeURIComponent(q);

    return fetch(endpoint)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status !== 200 || !data.result) return null;
        var coords = { lat: data.result.latitude, lng: data.result.longitude };
        geocodeCache[key] = coords;
        return coords;
      })
      .catch(function () { return null; });
  }

  function haversineMiles(a, b) {
    var R = 3958.8;
    var dLat = (b.lat - a.lat) * Math.PI / 180;
    var dLng = (b.lng - a.lng) * Math.PI / 180;
    var lat1 = a.lat * Math.PI / 180;
    var lat2 = b.lat * Math.PI / 180;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  // -> Promise<Map<school.id, milesOrNull>>
  function computeDistances(schools, originCoords) {
    var work = schools.map(function (school) {
      var postcode = (school.postcode || '').trim();
      if (!postcode) return Promise.resolve([school.id, null]);
      return geocode(postcode).then(function (coords) {
        return [school.id, coords ? haversineMiles(originCoords, coords) : null];
      });
    });
    return Promise.all(work).then(function (pairs) {
      var map = new Map();
      pairs.forEach(function (pair) { map.set(pair[0], pair[1]); });
      return map;
    });
  }

  function distanceLabel(miles) {
    if (miles === null || miles === undefined) return { text: 'Distance unavailable', unavailable: true };
    if (miles < 0.1) return { text: 'Less than 0.1 mi away', unavailable: false };
    return { text: miles.toFixed(1) + ' mi away', unavailable: false };
  }

  // "Prices from £X" (lowest across whatever the school offers) by
  // default; the exact figure for a specific licence once that's what's
  // being searched.
  function priceLabel(school, activeLicence) {
    var licences = school.licences || [];
    if (licences.length === 0) return null;

    // A licence a school teaches but hasn't published a fixed price for
    // (e.g. "by arrangement") must say so honestly rather than falling
    // back to a different licence's price, which would misrepresent it.
    if (activeLicence && licences.indexOf(activeLicence) !== -1) {
      return school.prices[activeLicence] !== undefined
        ? LICENCE_LABELS[activeLicence] + ' — £' + school.prices[activeLicence]
        : LICENCE_LABELS[activeLicence] + ' — price on request';
    }

    var prices = licences.map(function (l) { return school.prices[l]; }).filter(function (p) { return p !== undefined; });
    if (prices.length === 0) return null;
    return 'Prices from £' + Math.min.apply(null, prices);
  }

  // Pure filter — combinable, not mutually-exclusive modes. licence and q
  // narrow the same list together; postcode/distance is handled separately
  // (it re-sorts and annotates, it never excludes a result).
  function filterSchools(schools, criteria) {
    criteria = criteria || {};
    var city = criteria.city;
    var licence = criteria.licence;
    var q = norm(criteria.q);

    return schools.filter(function (school) {
      if (city && school.city !== city) return false;
      if (licence && school.licences.indexOf(licence) === -1) return false;
      if (q && norm(school.name).indexOf(q) === -1 && norm(school.area).indexOf(q) === -1) return false;
      return true;
    });
  }

  function sortSchools(schools, opts) {
    opts = opts || {};
    var sortBy = opts.sortBy || 'relevance';
    var distanceById = opts.distanceById || null;
    var activeLicence = opts.activeLicence;

    var list = schools.slice();

    if (sortBy === 'name') {
      return list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    }

    if (sortBy === 'price') {
      // A school with no published price for the relevant licence (or no
      // published prices at all) sorts last rather than crashing or
      // silently comparing against an unrelated licence's price.
      function cheapest(school) {
        if (activeLicence && school.prices[activeLicence] !== undefined) return school.prices[activeLicence];
        var known = school.licences.map(function (l) { return school.prices[l]; }).filter(function (p) { return p !== undefined; });
        return known.length ? Math.min.apply(null, known) : null;
      }
      return list.sort(function (a, b) {
        var pa = cheapest(a);
        var pb = cheapest(b);
        if (pa === null) return pb === null ? 0 : 1;
        if (pb === null) return -1;
        return pa - pb;
      });
    }

    if ((sortBy === 'distance' || sortBy === 'relevance') && distanceById) {
      return list.sort(function (a, b) {
        var da = distanceById.get(a.id);
        var db = distanceById.get(b.id);
        if (da === null || da === undefined) return db === null || db === undefined ? 0 : 1;
        if (db === null || db === undefined) return -1;
        return da - db;
      });
    }

    return list; // relevance with no postcode given: data order
  }

  // ------------------------------------------------------------------
  // Rendering
  // ------------------------------------------------------------------
  function badgesHtml(licences) {
    return LICENCE_ORDER.filter(function (l) { return licences.indexOf(l) !== -1; }).map(function (l) {
      return '<span class="licence-badge licence-badge--' + l + '">' + LICENCE_LABELS[l] + '</span>';
    }).join('');
  }

  function tagsHtml(tags) {
    return (tags || []).map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
  }

  // Full interactive card — price, distance, badges, tags, and a "Visit
  // website" CTA. Used on schools.html. A <div> rather than an <a>, since
  // the website CTA needs its own real link and an <a> can't contain
  // another <a> — the title is a real link to the profile page, "Visit
  // website" a real outbound link, and clicking anywhere else on the
  // card navigates to the profile too (event delegation below), so the
  // whole-card-clickable feel is kept without nesting anchors.
  function renderListingCard(school, opts) {
    opts = opts || {};
    var price = priceLabel(school, opts.activeLicence);
    var dist = opts.distanceById ? distanceLabel(opts.distanceById.get(school.id)) : null;

    var card = document.createElement('div');
    card.className = 'listing-card';
    card.style.cursor = 'pointer';
    card.innerHTML =
      '<div class="listing-card__image">' +
        '<span class="listing-card__rank">' + school.area + '</span>' +
        school.shortName +
      '</div>' +
      '<div class="listing-card__content">' +
        '<div class="listing-card__rating"><span class="tag">No reviews yet</span></div>' +
        '<h3><a href="' + school.href + '">' + school.name + '</a></h3>' +
        (price ? '<p class="card-price">' + price + '</p>' : '') +
        '<p class="text-body-sm" style="color:var(--text-2)">' + school.description + '</p>' +
        (dist ? '<p class="card-distance' + (dist.unavailable ? ' card-distance--unavailable' : '') + '">' + dist.text + '</p>' : '') +
        '<div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:12px;">' +
          badgesHtml(school.licences) + tagsHtml(school.tags) +
        '</div>' +
        (school.website ? '<div style="margin-top:12px;"><a href="' + school.website + '" class="btn btn--primary btn--sm" target="_blank" rel="noopener">Visit website</a></div>' : '') +
      '</div>';

    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return; // real links (title, website) behave normally
      window.location.href = school.href;
    });

    return card;
  }

  // Generic, non-interactive teaser card for the homepage — name, area,
  // licence badges, link. Deliberately no price, no distance: the
  // homepage showcase isn't a search result, schools.html is.
  function renderTeaser(container, schools) {
    container.innerHTML = '';
    schools.forEach(function (school) {
      var a = document.createElement('a');
      a.href = school.href;
      a.className = 'listing-card';
      a.innerHTML =
        '<div class="listing-card__image">' +
          '<span class="listing-card__rank">' + school.area + '</span>' +
          school.shortName +
        '</div>' +
        '<div class="listing-card__content">' +
          '<div class="listing-card__rating"><span class="tag">No reviews yet</span></div>' +
          '<h3>' + school.name + '</h3>' +
          '<p class="text-body-sm" style="color:var(--text-2)">' + school.description + '</p>' +
          '<div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:12px;">' +
            badgesHtml(school.licences) + tagsHtml(school.tags) +
          '</div>' +
        '</div>';
      container.appendChild(a);
    });
  }

  // ------------------------------------------------------------------
  // URL state — the two params consumers (index.html linking out,
  // schools.html reading/writing) share this one contract so they can't
  // drift on param names.
  // ------------------------------------------------------------------
  function toQueryString(params) {
    var usp = new URLSearchParams();
    ['city', 'licence', 'postcode', 'q', 'sort'].forEach(function (key) {
      var val = params[key];
      if (val) usp.set(key, val);
    });
    return usp.toString();
  }

  function parseQueryString(search) {
    var usp = new URLSearchParams(search);
    return {
      city: usp.get('city') || '',
      licence: usp.get('licence') || '',
      postcode: usp.get('postcode') || '',
      q: usp.get('q') || '',
      sort: usp.get('sort') || 'relevance'
    };
  }

  return {
    LICENCE_LABELS: LICENCE_LABELS,
    norm: norm,
    isPostcodeLike: isPostcodeLike,
    geocode: geocode,
    haversineMiles: haversineMiles,
    computeDistances: computeDistances,
    distanceLabel: distanceLabel,
    priceLabel: priceLabel,
    filterSchools: filterSchools,
    sortSchools: sortSchools,
    renderListingCard: renderListingCard,
    renderTeaser: renderTeaser,
    toQueryString: toQueryString,
    parseQueryString: parseQueryString
  };
})();
