import React from 'react';
import { getWeatherIcon, getWeatherDescription } from '../utils/colors';

export default function CurrentConditions({ locationName, weather, isDay }) {
  if (!weather || !weather.current) return null;
  const current = weather.current;
  const icon = getWeatherIcon(current.weather_code, !isDay);
  const desc = getWeatherDescription(current.weather_code);

  return (
    <div className="current-conditions">
      <h2>{locationName}</h2>
      <div className="temp-large">
        {Math.round(current.temperature_2m)}°C
      </div>
      <div className="condition-desc">
        {icon} {desc}
      </div>
      <div className="condition-details">
        <span>Wind: {current.wind_speed_10m} km/h</span>
      </div>
    </div>
  );
}
