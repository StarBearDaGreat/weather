export async function fetchCoordinates(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network error during geocoding.');
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('Location not found. Please try another city.');
  }
  return data.results[0]; // { name, country, latitude, longitude }
}

export async function fetchReverseGeocode(lat, lon) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || "Current Location";
  } catch (err) {
    return "Current Location";
  }
}

export async function fetchForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,weather_code,wind_speed_10m,precipitation',
    hourly: 'temperature_2m,weather_code,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum',
    timezone: 'auto'
  });
  
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network error fetching forecast.');
  const data = await res.json();
  return data;
}
