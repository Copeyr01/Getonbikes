// Single source of truth for school data, used by both the homepage teaser
// (index.html) and the full listing/filter page (schools.html). Adding,
// removing or updating a school is a change here only — nothing else should
// need hand-editing to stay in sync (hero stats, licence-grid counts and
// both pages' listings all derive from this array).
window.SCHOOLS = [
  {
    // Real prices, from EMT's own "Courses and Price List" page (2026):
    // CBT £195 (weekday; £210 at weekends/bank holidays — weekday used
    // as the base figure, consistent with the rest of the site). Full A
    // (Direct Access Scheme) is a 4-day or 5-day course, £1,140 or
    // £1,440 respectively (both include the pre-DAS assessment) — the
    // cheaper 4-day figure used as the base. A1/A2 training is also
    // offered but priced hourly (£55/hr for 2 students to an instructor,
    // £75/hr 1-to-1, plus test fees) rather than as a fixed package, so
    // there's no honest single figure to publish for those.
    id: 'edinburgh-motorcycle-training',
    name: 'Edinburgh Motorcycle Training',
    shortName: 'EMT',
    city: 'edinburgh',
    area: 'Straiton',
    postcode: '',
    licences: ['cbt', 'a1', 'a2', 'full-a'],
    prices: { cbt: 195, 'full-a': 1140 },
    description: 'Independent motorcycle school in Straiton offering CBT, A1, A2 and full licence (DAS) training, on and off-road.',
    tags: ['Weekday & weekend courses'],
    href: 'pages/schools/edinburgh-motorcycle-training.html',
    website: 'https://edinburghmotorcycletraining.com'
  },
  {
    // Real prices, from Two Wheels' own CBT and DAS brochures (2026):
    // CBT £265 (2-day New Rider course); DAS £990 covers either the A2
    // or Category A (Full A) Mod 1 & 2 test route on the same course
    // structure. A1 training is offered "by arrangement" with no fixed
    // published price, so it's listed but deliberately has no `prices`
    // entry rather than guessing a figure.
    id: 'two-wheels',
    name: 'Two Wheels Motorcycle Training',
    shortName: 'TW',
    city: 'edinburgh',
    area: 'Peffermill',
    postcode: 'EH16 5LL',
    licences: ['cbt', 'a1', 'a2', 'full-a'],
    prices: { cbt: 265, a2: 990, 'full-a': 990 },
    description: 'Honda Approved School of Motorcycling, training riders across Edinburgh and the Lothians since 1991.',
    tags: ['Honda Approved School'],
    href: 'pages/schools/two-wheels.html',
    website: 'https://www.twowheels.co.uk/training'
  },
  {
    // Real prices, from Harley's own "Training Structure" price sheet
    // (2026): CBT is £199 (weekday full-day course; £225 at weekends —
    // weekday used as the base figure, consistent with the rest of the
    // site). A1/A2/Full A training is priced per lesson (Session/DAS
    // lessons, Mod 1 & 2 practice and test fees all billed separately,
    // with the number of lessons varying "depending on individual needs
    // and riding abilities") rather than as a single fixed package, so
    // there's no honest single figure to publish for those — left out
    // of `prices` rather than inventing a total from an assumed lesson
    // count.
    id: 'harleys-rider-training',
    name: 'Harley’s Rider Training',
    shortName: 'HRT',
    city: 'edinburgh',
    area: 'Gorgie',
    postcode: 'EH11 2RP',
    licences: ['cbt', 'a1', 'a2', 'full-a'],
    prices: { cbt: 199 },
    description: 'Family-run school in Gorgie providing CBT, A1, A2, full licence training and Mod 1 & 2 test preparation since 1997.',
    tags: ['Mod 1 & 2 test prep'],
    href: 'pages/schools/harleys-rider-training.html',
    website: 'https://harleys.training/branches/edinburgh/'
  }
];
