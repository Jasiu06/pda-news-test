const BREAKING_NEWS = [
    {
        title: "Al-Shahid Attack On Police Station Kills Three · Live updates",
        url: "breaking-news-al-shahid.html"
    },
    {
        title: "National Assembly in Deadlock Over Constitutional Amendments",
        url: "politics-democracy-begins.html"
    },
    {
        title: "New Makoko Water Quality Tests Show Remarkable Improvement",
        url: "water-tests.html"
    },
    {
        title: "Lagos Zoo Announces Birth of Rare Pallas Cat",
        url: "pallas-cat.html"
    },
    {
        title: "Progressive Bloc Consolidation: Joint Parliamentary Group Formed",
        url: "progressive-parties-group.html"
    }
];

function updateBreakingNews() {
    const breakingText = document.querySelector('.breaking-text');
    const breakingLink = document.querySelector('.breaking');
    if (!breakingText || !breakingLink) return;

    const randomIndex = Math.floor(Math.random() * BREAKING_NEWS.length);
    const news = BREAKING_NEWS[randomIndex];

    breakingText.textContent = news.title;
    
    // Get root path to ensure links work from any page
    if (typeof getRootPath === 'function') {
        const root = getRootPath();
        breakingLink.href = news.url.startsWith('http') ? news.url : root + news.url;
    } else {
        breakingLink.href = news.url;
    }
}

// Export for use in components-loader.js
window.updateBreakingNews = updateBreakingNews;
