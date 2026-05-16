import React, { useState, useEffect } from 'react';
import LocationSearch from './components/LocationSearch';
import CurrentConditions from './components/CurrentConditions';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import OutfitCard from './components/OutfitCard';
import { fetchForecast, fetchReverseGeocode } from './utils/weather';
import { getOutfitSuggestion } from './utils/outfit';
import { getThemeToken } from './utils/colors';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [outfit, setOutfit] = useState(null);
  const [theme, setTheme] = useState('theme_cloudy_mild');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            setLocationName('Current Location');
            await loadWeatherForCoords(lat, lon);
            const city = await fetchReverseGeocode(lat, lon);
            setLocationName(city);
          } catch (err) {
            setError(err.message);
            setLoading(false);
          }
        },
        (err) => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const loadWeatherForCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchForecast(lat, lon);
      setWeatherData(data);
      
      const currentTemp = data.current.temperature_2m;
      const currentCode = data.current.weather_code;
      const currentWind = data.current.wind_speed_10m;
      // Note: Open-meteo might not return is_day if not requested in current vars. Let's assume day if missing.
      const isNight = data.current.is_day === 0;

      const suggestion = getOutfitSuggestion(currentTemp, currentCode, currentWind);
      setOutfit(suggestion);

      const themeToken = getThemeToken(currentCode, currentTemp, isNight);
      setTheme(themeToken);
      
      document.documentElement.className = themeToken;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationFound = (location) => {
    setLocationName(`${location.name}, ${location.country}`);
    loadWeatherForCoords(location.latitude, location.longitude);
  };

  const handleError = (msg) => {
    setError(msg);
  };

  return (
    <div className={`app-container ${theme}`}>
      <header>
        <LocationSearch onLocationFound={handleLocationFound} onError={handleError} />
      </header>

      <main>
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Loading...</div>}
        
        {!loading && !weatherData && !error && (
          <div className="empty-state">
            <p>Search for a city to get the weather and outfit suggestion.</p>
          </div>
        )}

        {!loading && weatherData && (
          <>
            <CurrentConditions 
              locationName={locationName} 
              weather={weatherData} 
              isDay={weatherData.current?.is_day !== 0} 
            />
            <OutfitCard outfit={outfit} />
            <HourlyForecast hourly={weatherData.hourly} />
            <WeeklyForecast daily={weatherData.daily} />
          </>
        )}
      </main>
    </div>
  );
}
