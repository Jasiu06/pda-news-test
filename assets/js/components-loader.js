// Function to get the root path relative to the current file
function getRootPath() {
    // Look for the script tag that loaded this file
    const script = document.querySelector('script[src*="components-loader.js"]');
    if (script) {
        // Use .src to get the absolute URL, which is more robust
        const src = script.src;
        // Find where "assets/js/components-loader.js" begins
        const target = 'assets/js/components-loader.js';
        const index = src.indexOf(target);
        if (index !== -1) {
            return src.substring(0, index);
        }
    }
    // Fallback if script not found or doesn't match
    return '';
}

async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const root = getRootPath();
        const url = root + file;
        console.log(`Fetching component: ${url} for element: ${id}`);
        const response = await fetch(url);
        if (response.ok) {
            let html = await response.text();
            
            // Fix relative paths in the loaded HTML (images/links) 
            // to be correct relative to the current page
            if (root !== "") {
                // This replaces paths like src="assets/..." with src="../assets/..."
                html = html.replace(/(src|href)="(?!\/|http|https)([^"]+)"/g, `$1="${root}$2"`);
            }
            
            el.innerHTML = html;
            return true;
        } else {
            console.error(`Failed to load component: ${file}. Status: ${response.status} ${response.statusText}`);
        }
    } catch (err) {
        console.error(`Error fetching component: ${file}`, err);
    }
    return false;
}

function setActiveNav() {
    const body = document.body;
    const navKey = body.getAttribute('data-nav');
    if (!navKey) return;
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('data-nav') === navKey) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Re-initialize scripts that depend on the injected HTML
function initInjectedScripts() {
    // 1. Initialize AQI components (Ticker and Panel)
    if (typeof window.initAQI === 'function') {
        window.initAQI();
    }

    // 2. Re-initialize Nav scrolling
    const nav = document.querySelector('.nav-strip');
    if (nav) {
        let isDown = false, startX, scrollLeft;
        nav.addEventListener('mousedown', e => {
            isDown = true;
            nav.style.cursor = 'grabbing';
            startX = e.pageX - nav.offsetLeft;
            scrollLeft = nav.scrollLeft;
        });
        nav.addEventListener('mouseleave', () => { isDown = false; nav.style.cursor = ''; });
        nav.addEventListener('mouseup', () => { isDown = false; nav.style.cursor = ''; });
        nav.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - nav.offsetLeft;
            nav.scrollLeft = scrollLeft - (x - startX);
        });
    }

    // 3. Trigger relative time update
    if (typeof updateRelativeTimes === 'function') updateRelativeTimes();
}

document.addEventListener('DOMContentLoaded', async () => {
    // Sequence the loads to ensure DOM is ready
    await loadComponent('header-placeholder', 'components/header.html');
    await loadComponent('footer-placeholder', 'components/footer.html');
    
    setActiveNav();
    initInjectedScripts();
});
