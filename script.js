// Utilities
async function fetchCoordinates(query) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`);
  if (!res.ok) throw new Error('Network error during geocoding.');
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error('Location not found.');
  return data.results[0];
}

async function fetchReverseGeocode(lat, lon) {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || "Current Location";
  } catch (err) {
    return "Current Location";
  }
}

async function fetchForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,weather_code,wind_speed_10m,precipitation',
    hourly: 'temperature_2m,weather_code,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum',
    timezone: 'auto'
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!res.ok) throw new Error('Network error fetching forecast.');
  return res.json();
}

function getOutfitSuggestion(temperature, weatherCode, windSpeed) {
  let baseKey = 'outfit_mild';
  let label = '';
  
  if (temperature < 5) {
    baseKey = 'outfit_freezing';
    label = 'Heavy coat, scarf, gloves, boots';
  } else if (temperature >= 5 && temperature <= 14) {
    baseKey = 'outfit_cold';
    label = 'Jacket or jumper, jeans, closed shoes';
  } else if (temperature >= 15 && temperature <= 20) {
    baseKey = 'outfit_mild';
    label = 'Light jacket or cardigan, jeans or chinos';
  } else if (temperature >= 21 && temperature <= 27) {
    baseKey = 'outfit_warm';
    label = 'T-shirt, shorts or light dress, trainers';
  } else {
    baseKey = 'outfit_hot';
    label = 'Linen or light fabrics, sandals, sun hat';
  }

  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82) || (weatherCode >= 95 && weatherCode <= 99)) {
    label += ' + waterproof layer/umbrella';
  }
  if (windSpeed > 20) {
    label += ' + windbreaker';
  }
  return { key: baseKey, label };
}

function getThemeToken(weatherCode, temperature, isNight) {
  if (isNight) return 'theme_night';
  const isSunny = weatherCode <= 1;
  const isCloudy = weatherCode === 2 || weatherCode === 3;
  const isStormy = weatherCode >= 95;
  if (isStormy) return 'theme_stormy';
  if (isSunny) return temperature > 20 ? 'theme_sunny_hot' : 'theme_sunny_cold';
  if (isCloudy) return 'theme_cloudy_mild';
  if (weatherCode >= 51 && weatherCode <= 86) return 'theme_rainy_cold';
  return 'theme_cloudy_mild';
}

function getWeatherIcon(code, isNight=false) {
  const iconMap = {
    0: isNight ? '🌙' : '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️', 51: '🌧️', 53: '🌧️', 55: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️', 71: '❄️', 73: '❄️', 75: '❄️',
    80: '🌧️', 81: '🌧️', 82: '🌧️', 95: '⛈️', 96: '⛈️', 99: '⛈️'
  };
  return iconMap[code] || '☁️';
}

function getWeatherDescription(code) {
  const descMap = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 51: 'Light drizzle', 61: 'Slight rain', 71: 'Slight snow', 80: 'Rain showers', 95: 'Thunderstorm'
  };
  return descMap[code] || 'Cloudy';
}

// UI Elements
const els = {
  form: document.getElementById('search-form'),
  input: document.getElementById('search-input'),
  btn: document.getElementById('search-button'),
  loading: document.getElementById('loading'),
  error: document.getElementById('error-message'),
  empty: document.getElementById('empty-state'),
  content: document.getElementById('weather-content'),
  current: document.getElementById('current-conditions'),
  outfit: document.getElementById('outfit-card'),
  hourly: document.getElementById('hourly-scroll'),
  weekly: document.getElementById('weekly-forecast')
};

function showState(state) {
  els.loading.style.display = state === 'loading' ? 'block' : 'none';
  els.error.style.display = state === 'error' ? 'block' : 'none';
  els.empty.style.display = state === 'empty' ? 'block' : 'none';
  els.content.style.display = state === 'content' ? 'block' : 'none';
  if (state === 'loading') {
    els.btn.disabled = true;
    els.input.disabled = true;
  } else {
    els.btn.disabled = false;
    els.input.disabled = false;
  }
}

async function loadWeather(lat, lon, locationName) {
  showState('loading');
  try {
    const data = await fetchForecast(lat, lon);
    const curr = data.current;
    const isNight = curr.is_day === 0;
    
    // Theme
    const theme = getThemeToken(curr.weather_code, curr.temperature_2m, isNight);
    document.body.className = theme;

    // Current
    els.current.innerHTML = `
      <h2>${locationName}</h2>
      <div class="temp-large">${Math.round(curr.temperature_2m)}°C</div>
      <div class="condition-desc">${getWeatherIcon(curr.weather_code, isNight)} ${getWeatherDescription(curr.weather_code)}</div>
      <div class="condition-details">Wind: ${curr.wind_speed_10m} km/h</div>
    `;

    // Outfit
    const outfit = getOutfitSuggestion(curr.temperature_2m, curr.weather_code, curr.wind_speed_10m);
    els.outfit.innerHTML = `
      <h3>What to wear</h3>
      <div class="outfit-image-container">
        <img src="public/images/${outfit.key}.png" alt="${outfit.label}" class="outfit-image" onerror="this.src='public/images/outfit_mild.png'" />
      </div>
      <p class="outfit-label">${outfit.label}</p>
    `;

    // Hourly
    let hourlyHtml = '';
    for(let i=0; i<24; i++) {
      const timeStr = data.hourly.time[i];
      const hour = new Date(timeStr).getHours();
      const isN = hour < 6 || hour > 19;
      hourlyHtml += `
        <div class="hourly-item">
          <span>${i===0 ? 'Now' : hour+':00'}</span>
          <span class="hourly-icon">${getWeatherIcon(data.hourly.weather_code[i], isN)}</span>
          <span>${Math.round(data.hourly.temperature_2m[i])}°</span>
        </div>
      `;
    }
    els.hourly.innerHTML = hourlyHtml;

    // Weekly
    let weeklyHtml = '';
    for(let i=0; i<7; i++) {
      const dayName = i===0 ? 'Today' : new Date(data.daily.time[i]).toLocaleDateString('en-US', {weekday:'short'});
      weeklyHtml += `
        <div class="weekly-item">
          <span class="weekly-day">${dayName}</span>
          <span class="weekly-icon">${getWeatherIcon(data.daily.weather_code[i])}</span>
          <span class="weekly-temps">
            <span class="temp-max">${Math.round(data.daily.temperature_2m_max[i])}°</span>
            <span class="temp-min">${Math.round(data.daily.temperature_2m_min[i])}°</span>
          </span>
        </div>
      `;
    }
    els.weekly.innerHTML = weeklyHtml;

    showState('content');
  } catch(err) {
    els.error.textContent = err.message;
    showState('error');
  }
}

els.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = els.input.value.trim();
  if(!q) return;
  showState('loading');
  try {
    const loc = await fetchCoordinates(q);
    els.input.value = '';
    loadWeather(loc.latitude, loc.longitude, `${loc.name}, ${loc.country}`);
  } catch(err) {
    els.error.textContent = err.message;
    showState('error');
  }
});

// Init
if (navigator.geolocation) {
  showState('loading');
  navigator.geolocation.getCurrentPosition(async pos => {
    const {latitude, longitude} = pos.coords;
    loadWeather(latitude, longitude, 'Current Location');
    const actualName = await fetchReverseGeocode(latitude, longitude);
    if(actualName !== 'Current Location') {
       loadWeather(latitude, longitude, actualName);
    }
  }, err => {
    showState('empty');
  });
} else {
  showState('empty');
}
