export function getThemeToken(weatherCode, temperature, isNight = false) {
  if (isNight) return 'theme_night';
  
  // WMO Codes
  // 0: clear sky
  // 1-3: mainly clear, partly cloudy, overcast
  // 51-67, 80-82, 95-99: rain/showers/storms
  // 71-77, 85-86: snow
  
  const isSunny = weatherCode <= 1;
  const isCloudy = weatherCode === 2 || weatherCode === 3;
  const isRainyOrSnowy = (weatherCode >= 51 && weatherCode <= 86);
  const isStormy = weatherCode >= 95;

  if (isStormy) return 'theme_stormy';
  
  if (isSunny) {
    if (temperature > 20) return 'theme_sunny_hot';
    return 'theme_sunny_cold';
  }

  if (isCloudy) {
    return 'theme_cloudy_mild';
  }

  if (isRainyOrSnowy) {
    return 'theme_rainy_cold';
  }

  return 'theme_cloudy_mild';
}

export function getWeatherIcon(code, isNight=false) {
  const iconMap = {
    0: isNight ? '🌙' : '☀️',
    1: isNight ? '🌤️' : '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌧️',
    53: '🌧️',
    55: '🌧️',
    61: '🌧️',
    63: '🌧️',
    65: '🌧️',
    71: '❄️',
    73: '❄️',
    75: '❄️',
    80: '🌧️',
    81: '🌧️',
    82: '🌧️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️',
  };
  return iconMap[code] || '☁️';
}

export function getWeatherDescription(code) {
    const descMap = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    };
    return descMap[code] || 'Unknown';
}
