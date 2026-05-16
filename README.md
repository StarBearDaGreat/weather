# 🌤️ Weather & Outfit App

A clean, minimal weather app that tells you what to wear. Built for the general public, mobile-first, with a personality.

---

## What it does

1. **Search any city or location** — the app validates it exists before doing anything else
2. **Fetches the forecast** — current conditions, hourly breakdown, and a 7-day weekly view
3. **Suggests an outfit** — an illustrated character shows you what to wear based on the weather

---

## Features

- 🌡️ **Real-time weather** via the [Open-Meteo API](https://open-meteo.com) (free, no API key required)
- 📍 **Location search & validation** via the Open-Meteo Geocoding API
- 🕐 **Hourly forecast** — scrollable, at-a-glance view
- 📅 **Weekly forecast** — compact day-by-day rows
- 🎨 **Weather-reactive UI** — colors shift based on temperature and sky conditions
- 👗 **Outfit suggestions** — flat illustrated character that dresses for the weather

---

## Design System

| Property | Detail |
|---|---|
| Style | Clean & minimal |
| Platform | Mobile-first, responsive |
| Colors | Reactive to temperature + sky conditions |
| Typography | Clean sans-serif, large bold temperature |
| Illustrations | Flat, gender-neutral character |

### Color Moods

| Condition | Palette |
|---|---|
| Sunny + hot | Warm amber and golden yellows |
| Sunny + cold | Crisp blues with cool white |
| Cloudy + mild | Muted greiges and soft greys |
| Rainy + cold | Deep slate blue, desaturated |
| Stormy | Dark charcoal with electric accents |
| Night | Deep indigo or near-black |

### Outfit Logic

| Temperature | Base Outfit |
|---|---|
| Below 5°C | Heavy coat, scarf, gloves, boots |
| 5–14°C | Jacket or jumper, jeans, closed shoes |
| 15–20°C | Light jacket or cardigan, jeans or chinos |
| 21–27°C | T-shirt, shorts or light dress, trainers |
| Above 28°C | Linen or light fabrics, sandals, sun hat |

Rain and wind layer on top of the temperature outfit automatically.

---

## APIs Used

| API | Purpose | Docs |
|---|---|---|
| Open-Meteo Forecast | Weather data | [docs](https://open-meteo.com/en/docs) |
| Open-Meteo Geocoding | Location search & validation | [docs](https://open-meteo.com/en/docs/geocoding-api) |

Both APIs are free for non-commercial use and require no API key.

---

## App Flow

```
User enters city name
        ↓
Geocoding API validates location + returns coordinates
        ↓
Forecast API fetches weather for those coordinates
        ↓
App reads temperature + sky conditions
        ↓
UI colors update reactively
        ↓
Outfit illustration + suggestion displayed
```

---

## Project Structure

```
/
├── README.md
├── AGENTS.md
├── src/
│   ├── components/
│   │   ├── LocationSearch.jsx
│   │   ├── CurrentConditions.jsx
│   │   ├── HourlyForecast.jsx
│   │   ├── WeeklyForecast.jsx
│   │   └── OutfitCard.jsx
│   ├── utils/
│   │   ├── weather.js        # API calls
│   │   ├── outfit.js         # Outfit logic
│   │   └── colors.js         # Reactive color logic
│   └── App.jsx
```
