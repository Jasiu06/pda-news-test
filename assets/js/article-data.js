/**
 * Centralized Article Database
 * Used to populate index cards, related stories, and dynamic metadata.
 */
const ARTICLES = [
  {
    id: "democracy-begins",
    title: "Nigerian democracy begins amidst fierce debate and chaos",
    deck: "The first day of the National Assembly has been filled with both excitement and chaos, from fierce disputes over constitutional amendments to shocking accusations during the judiciary hearing.",
    category: "Politics",
    tags: ["National Assembly", "Constitution", "Democracy", "Politics"],
    author: "Abraham Mutfwang",
    date: "2026-04-08T09:00:00Z",
    url: "politics-democracy-begins.html",
    img: "assets/img/national-assembly.webp"
  },
  {
    id: "new-makoko-rents-high",
    title: "New Makoko apartment rents hit record high for third straight quarter",
    deck: "New Makoko rent prices skyrocket as demand for waterfront property grows. Local residents fear displacement as luxury developers eye the district.",
    category: "Economy",
    tags: ["Real Estate", "New Makoko", "Housing", "Economy"],
    author: "Tunde Ojo",
    date: "2026-04-08T09:00:00Z",
    url: "new-makoko-rents.html",
    img: "assets/img/evolving-new-makoko.webp"
  },
  {
    id: "new-makoko-museum",
    title: "City museum opens in New Makoko on 10th anniversary of foundation",
    deck: "A landmark cultural institution marks a decade of growth and resilience in the floating city of New Makoko.",
    category: "Culture",
    tags: ["Arts", "History", "New Makoko", "Culture"],
    author: "Forward! Staff",
    date: "2026-04-08T08:00:00Z",
    url: "new-makoko-museum.html",
    img: "assets/img/makoko-museum.webp"
  },
  {
    id: "cassava-blight",
    title: "Researchers at University of Nigeria announce breakthrough in cassava blight resistance",
    deck: "New genetic techniques could secure the future of Nigeria's most vital staple crop.",
    category: "Tech",
    tags: ["Agriculture", "Science", "Innovation", "Tech"],
    author: "Dr. Ifeanyi Okoro",
    date: "2026-04-08T08:00:00Z",
    url: "cassava-blight.html",
    img: "assets/img/water-tests.webp" 
  },
  {
    id: "progressive-bloc",
    title: "Progressive parties create joint parliamentary group",
    deck: "Following a fractured election, a new progressive bloc consolidates its platform, publishing its defining 'Points of Unity' exclusively in Forward!",
    category: "Politics",
    tags: ["Coalition", "Progressive", "Unity", "Politics"],
    author: "Hadiza Usaini",
    date: "2026-04-08T06:00:00Z",
    url: "progressive-parties-group.html",
    img: "assets/img/improve.webp"
  },
  {
    id: "new-makoko-water-tests",
    title: "New Makoko water tests pass with flying colours",
    deck: "Latest environmental monitoring shows significant reduction in pollutants after new filtration rollout in New Makoko.",
    category: "Tech",
    tags: ["Infrastructure", "Environment", "Health", "New Makoko", "Tech"],
    author: "Forward! Staff",
    date: "2026-04-08T05:00:00Z",
    url: "new-makoko-water-tests.html",
    img: "assets/img/water-tests.webp"
  },
  {
    id: "friln-chairman",
    title: "FRILN chairman reportedly unaware of appointment as deputy speaker",
    deck: "Theodore Nwobi asks 'what is a deputy speaker' during lunch break at the National Assembly.",
    category: "Politics",
    tags: ["National Assembly", "Scandal", "Deputy Speaker", "Politics"],
    author: "Forward! Staff",
    date: "2026-04-08T05:00:00Z",
    url: "friln-chairman.html",
    img: "assets/img/nwobi.webp",
    imgStyle: "object-position: center 25%;"
  },
  {
    id: "parliament-builder",
    title: "Interactive: Build Your Own Parliament",
    deck: "Simulate the balance of power in the Constitutional Assembly. Add factions and forge theoretical majorities.",
    category: "Politics",
    tags: ["Interactive", "Data", "Simulation", "Politics"],
    author: "Interactive Desk",
    date: "2026-04-08T02:00:00Z",
    url: "build-your-own-parliament.html",
    img: "assets/img/government-builder.webp"
  },
  {
    id: "pallas-cat",
    title: "Lagos zoo welcomes new Pallas cat",
    deck: "Conservationists celebrate the arrival of the rare feline as part of an international breeding program in Lagos.",
    category: "Culture",
    tags: ["Wildlife", "Conservation", "Zoo", "Lagos", "Culture"],
    author: "Forward! Staff",
    date: "2026-04-08T00:00:00Z",
    url: "pallas-cat.html",
    img: "assets/img/pallas-cat.webp"
  },
  {
    id: "lagos-accident",
    title: "Yet another accident at the main junction to Lagos",
    deck: "Commuters call for urgent safety upgrades as the junction remains a 'death trap' for those entering Lagos.",
    category: "Lagos",
    tags: ["Safety", "Traffic", "Transport", "Lagos"],
    author: "Forward! Staff",
    date: "2026-04-07T10:00:00Z",
    url: "lagos-accident.html",
    img: "assets/img/junction-accident.webp"
  },
  // Politics Expansion to fill topic grid
  {
    id: "electoral-reform",
    title: "Electoral Reform Bill Passed in Late-Night Session",
    deck: "The new bill promises to overhaul how votes are counted in rural districts, despite fierce opposition.",
    category: "Politics",
    tags: ["Reform", "Law", "Election", "Politics"],
    author: "Hadiza Usaini",
    date: "2026-04-07T22:00:00Z",
    url: "electoral-reform.html",
    img: "assets/img/national-assembly.webp"
  },
  {
    id: "judiciary-hearing",
    title: "Judiciary Hearing Uncovers Shocking Factional Ties",
    deck: "New testimony suggests that several minor parties may be receiving funding from overseas conglomerates.",
    category: "Politics",
    tags: ["Judiciary", "Scandal", "Politics"],
    author: "Abraham Mutfwang",
    date: "2026-04-07T15:00:00Z",
    url: "judiciary-hearing.html",
    img: "assets/img/improve.webp"
  },
  {
    id: "factional-tensions",
    title: "Factions Clash Over Proposed Resource Allocation",
    deck: "The debate over who gets what in the new budget has brought the Assembly to a standstill.",
    category: "Politics",
    tags: ["Budget", "Economy", "Politics"],
    author: "Forward! Staff",
    date: "2026-04-07T11:00:00Z",
    url: "factional-tensions.html",
    img: "assets/img/government-builder.webp"
  },
  // Other placeholders
  {
    id: "abuja-quantum",
    title: "Quantum Computing Hub Announced for Abuja",
    deck: "Nigeria moves into the next generation of computing with a massive federal investment in the capital.",
    category: "Tech",
    tags: ["Abuja", "Innovation", "Computing", "Tech"],
    author: "Hadiza Usaini",
    date: "2026-04-07T08:00:00Z",
    url: "abuja-quantum.html",
    img: "assets/img/national-assembly.webp"
  },
  {
    id: "ibadan-weavers",
    title: "Traditional Weaver Guilds see Resurgence in Ibadan",
    deck: "The ancient arts are making a comeback as young apprentices flock to the city's weaving centers.",
    category: "Culture",
    tags: ["Arts", "Ibadan", "Tradition", "Culture"],
    author: "Leon Laoye",
    date: "2026-04-07T06:00:00Z",
    url: "ibadan-weavers.html",
    img: "assets/img/makoko-museum.webp"
  },
  {
    id: "super-eagles-qualify",
    title: "Super Eagles Qualify for 2060 World Cup",
    deck: "The national team secures their spot in the upcoming tournament with a stunning win in Port Harcourt.",
    category: "Sport",
    tags: ["Football", "National Team", "World Cup", "Sport"],
    author: "Forward! Staff",
    date: "2026-04-06T18:00:00Z",
    url: "super-eagles-qualify.html",
    img: "assets/img/national-assembly.webp"
  },
  {
    id: "cbdn-rollout",
    title: "Central Bank Digital Naira 2.0 Rollout",
    deck: "The next phase of the digital currency promises faster transactions and lower fees across the ECOWAS region.",
    category: "Economy",
    tags: ["Fintech", "Abuja", "Currency", "Economy"],
    author: "Abraham Mutfwang",
    date: "2026-04-06T12:00:00Z",
    url: "cbdn-rollout.html",
    img: "assets/img/government-builder.webp"
  },
  {
    id: "global-climate-accord",
    title: "Global Climate Accord Reached in Cairo",
    deck: "International delegates agree on landmark emissions targets that will reshape West African energy policy.",
    category: "World",
    tags: ["Climate", "Environment", "Diplomacy", "World"],
    author: "Forward! Staff",
    date: "2026-04-05T10:00:00Z",
    url: "global-climate-accord.html",
    img: "assets/img/water-tests.webp"
  }
];

// For backward compatibility while we migrate
const NEWS_METADATA = {};
ARTICLES.forEach(a => {
  NEWS_METADATA[a.url] = a.date;
});
