const WAQI_TOKEN = 'demo'; 

const cityMap = {
  "Lagos": "geo:6.5244;3.3792",
  "Abuja": "geo:9.0765;7.3986",
  "New Makoko": "geo:39.9042;116.4074", // Maps to Beijing
  "Kano": "geo:12.0022;8.5920",
  "Ibadan": "geo:7.3775;3.9470",
  "Port Harcourt": "geo:4.8156;7.0498",
  "Enugu": "geo:6.4483;7.5147",
  "Kaduna": "geo:10.5105;7.4165",
  "Benin City": "geo:6.3350;5.6037",
  "Maiduguri": "geo:11.8311;13.1510"
};

function getAQIColor(aqi) {
  if (aqi <= 50) return { status: "Good", color: "#00b050" };
  if (aqi <= 100) return { status: "Moderate", color: "#f4b400" };
  if (aqi <= 150) return { status: "Unhealthy for Sensitive Groups", color: "#ff9800" };
  if (aqi <= 200) return { status: "Unhealthy", color: "#e65100" };
  if (aqi <= 300) return { status: "Very Unhealthy", color: "#b71c1c" };
  return { status: "Hazardous", color: "#7e0023" };
}

let isFetching = false;

async function fetchRealAQI() {
  if (typeof aqiData === 'undefined' || isFetching) return;
  isFetching = true;
  console.log("Starting real-time AQI fetch via Open-Meteo...");

  const fetchPromises = aqiData.map(async (cityObj) => {
    const geoMatch = cityMap[cityObj.city] ? cityMap[cityObj.city].match(/geo:([\d.-]+);([\d.-]+)/) : null;
    if (!geoMatch) return;

    const lat = geoMatch[1];
    const lng = geoMatch[2];

    try {
      // Open-Meteo Air Quality API (Free, no token required)
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi`;
      const response = await fetch(url);
      const json = await response.json();
      
      if (json.current && json.current.us_aqi !== undefined) {
        const aqi = json.current.us_aqi;
        const info = getAQIColor(aqi);
        console.log(`Fetched AQI for ${cityObj.city}: ${aqi}`);
        cityObj.aqi = aqi;
        cityObj.status = info.status;
        cityObj.color = info.color;
      }
    } catch (err) {
      console.warn(`Could not fetch AQI for ${cityObj.city}:`, err);
    }
  });

  await Promise.all(fetchPromises);
  console.log("AQI fetch complete. Updating UI...");
  initAQITicker();
  initAQIPanel();
  isFetching = false;
}

function initAQITicker() {
  const scroll = document.getElementById('aqiScroll');
  if (!scroll || typeof aqiData === 'undefined') return false;

  let html = '';
  // Repeat for smooth infinite loop
  for (let i = 0; i < 4; i++) {
    aqiData.forEach(d => {
      const isLoaded = !!d.aqi;
      const dotColor = isLoaded ? d.color : '#333';
      const valColor = isLoaded ? d.color : 'var(--muted)';
      const valText = isLoaded ? d.aqi : '––';
      const fadeClass = isLoaded ? 'fade-in' : 'aqi-loading';

      html += `<span class="aqi-item ${fadeClass}">
        <span class="aqi-dot" style="background:${dotColor}"></span>
        <span class="aqi-city">${d.city}</span>
        <span class="aqi-val" style="color:${valColor}">${valText}</span>
      </span>`;
    });
  }
  scroll.innerHTML = html;
  return true;
}

function initAQIPanel() {
  const panel = document.getElementById('aqiCities');
  if (!panel || typeof aqiData === 'undefined') return false;

  let html = '';
  aqiData.forEach(d => {
    const isLoaded = !!d.aqi;
    const barWidth = isLoaded ? Math.min((d.aqi / 300) * 100, 100) : 0;
    const barColor = isLoaded ? d.color : '#222';
    const valText = isLoaded ? d.aqi : '...';
    const statusText = isLoaded ? d.status : 'SCANNING';
    const fadeClass = isLoaded ? 'fade-in' : 'aqi-loading';

    html += `
      <div class="aqi-city-row ${fadeClass}">
        <span class="aqi-city-name">${d.city}</span>
        <div class="aqi-bar-track">
          <div class="aqi-bar-fill" style="width:${barWidth}%; background:${barColor}"></div>
        </div>
        <span class="aqi-number" style="color:${isLoaded ? d.color : 'inherit'}">${valText}</span>
        <span class="aqi-status-badge" style="background:${isLoaded ? d.color + '22' : 'transparent'}; color:${isLoaded ? d.color : 'var(--muted)'}">${statusText}</span>
      </div>`;
  });
  panel.innerHTML = html;
  return true;
}

// Global initialization function
window.initAQI = function() {
    initAQITicker();
    initAQIPanel();
    fetchRealAQI(); // Start fetch in background
};
