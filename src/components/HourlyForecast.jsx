import React from 'react';
import { getWeatherIcon } from '../utils/colors';

export default function HourlyForecast({ hourly }) {
  if (!hourly) return null;

  const times = hourly.time.slice(0, 24);
  const temps = hourly.temperature_2m.slice(0, 24);
  const codes = hourly.weather_code.slice(0, 24);

  return (
    <div className="hourly-forecast">
      <div className="hourly-scroll">
        {times.map((timeStr, idx) => {
          const date = new Date(timeStr);
          const hour = date.getHours();
          const hourLabel = idx === 0 ? 'Now' : `${hour}:00`;
          const isNight = hour < 6 || hour > 19;

          return (
            <div key={idx} className="hourly-item">
              <span>{hourLabel}</span>
              <span className="hourly-icon">{getWeatherIcon(codes[idx], isNight)}</span>
              <span>{Math.round(temps[idx])}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
