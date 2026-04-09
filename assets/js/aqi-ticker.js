const aqiData = [
  { city: "Lagos",         aqi: 142, status: "Unhealthy",  color: "#e65100" },
  { city: "Abuja",         aqi:  68, status: "Moderate",   color: "#f4b400" },
  { city: "New Makoko",    aqi:  31, status: "Good",       color: "#00b050" },
  { city: "Kano",          aqi: 188, status: "Unhealthy",  color: "#e65100" },
  { city: "Ibadan",        aqi:  95, status: "Moderate",   color: "#f4b400" },
  { city: "Port Harcourt", aqi: 211, status: "V.Unhealthy",color: "#b71c1c" },
  { city: "Enugu",         aqi:  55, status: "Moderate",   color: "#f4b400" },
  { city: "Kaduna",        aqi: 121, status: "Unhealthy",  color: "#e65100" },
  { city: "Benin City",    aqi:  44, status: "Good",       color: "#00b050" },
  { city: "Maiduguri",     aqi: 163, status: "Unhealthy",  color: "#e65100" },
];

function initAQITicker() {
  const scroll = document.getElementById('aqiScroll');
  if (!scroll) return false;

  let html = '';
  // Repeat for smooth infinite loop
  for (let i = 0; i < 4; i++) {
    aqiData.forEach(d => {
      html += `<span class="aqi-item">
        <span class="aqi-dot" style="background:${d.color}"></span>
        <span class="aqi-city">${d.city}</span>
        <span class="aqi-val" style="color:${d.color}">${d.aqi}</span>
      </span>`;
    });
  }
  scroll.innerHTML = html;
  return true;
}

function initAQIPanel() {
  const panel = document.getElementById('aqiCities');
  if (!panel) return false;

  panel.innerHTML = '';
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
  return true;
}

// Global initialization function
window.initAQI = function() {
    const tickerDone = initAQITicker();
    const panelDone = initAQIPanel();
    return tickerDone || panelDone;
};

// Auto-retry mechanism to handle dynamic loading
(function autoInit() {
    let tickerInitialized = false;
    let panelInitialized = false;
    
    const attempt = () => {
        if (!tickerInitialized) tickerInitialized = initAQITicker();
        if (!panelInitialized) panelInitialized = initAQIPanel();
        
        // If both are found or we've tried enough, stop.
        // On article pages, panel will never be found, so we just keep trying for ticker.
        if (tickerInitialized && (panelInitialized || !document.querySelector('.aqi-panel'))) {
            return; 
        }
        setTimeout(attempt, 500);
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attempt);
    } else {
        attempt();
    }
})();
