import React from 'react';
import { getWeatherIcon } from '../utils/colors';

export default function WeeklyForecast({ daily }) {
  if (!daily) return null;

  const days = daily.time;
  const maxTemps = daily.temperature_2m_max;
  const minTemps = daily.temperature_2m_min;
  const codes = daily.weather_code;

  const getDayName = (dateStr, index) => {
    if (index === 0) return 'Today';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="weekly-forecast">
      {days.map((day, idx) => (
        <div key={idx} className="weekly-item">
          <span className="weekly-day">{getDayName(day, idx)}</span>
          <span className="weekly-icon">{getWeatherIcon(codes[idx])}</span>
          <span className="weekly-temps">
            <span className="temp-max">{Math.round(maxTemps[idx])}°</span>
            <span className="temp-min">{Math.round(minTemps[idx])}°</span>
          </span>
        </div>
      ))}
    </div>
  );
}
