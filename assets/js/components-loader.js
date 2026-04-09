async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        const response = await fetch(file);
        if (response.ok) {
            const html = await response.text();
            el.innerHTML = html;
            return true;
        }
    } catch (err) {
        console.error(`Failed to load component: ${file}`, err);
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
    // 1. Re-build AQI ticker (from index.html logic)
    if (typeof buildTicker === 'function') buildTicker();
    
    // 2. Re-build AQI panel (from index.html logic)
    const panel = document.getElementById('aqiCities');
    if (panel && typeof aqiData !== 'undefined') {
        panel.innerHTML = ''; // clear placeholder
        aqiData.forEach(d => {
            const pct = Math.min((d.aqi / 300) * 100, 100);
            panel.innerHTML += `
                <div class="aqi-city-row">
                    <span class="aqi-city-name">${d.city}</span>
                    <div class="aqi-bar-track">
                        <div class="aqi-bar-fill" style="width:${pct}%; background:${d.color}"></div>
                    </div>
                    <span class="aqi-number" style="color:${d.color}">${d.aqi}</span>
                    <span class="aqi-status-badge" style="background:${d.color}22; color:${d.color}">${d.status}</span>
                </div>`;
        });
    }

    // 3. Re-initialize Nav scrolling
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

    // 4. Trigger relative time update
    if (typeof updateRelativeTimes === 'function') updateRelativeTimes();
}

document.addEventListener('DOMContentLoaded', async () => {
    const headerLoaded = await loadComponent('header-placeholder', 'components/header.html');
    const footerLoaded = await loadComponent('footer-placeholder', 'components/footer.html');
    
    if (headerLoaded) {
        setActiveNav();
    }
    
    initInjectedScripts();
});
