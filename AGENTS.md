# 🤖 AGENTS.md

This file describes the agent architecture, responsibilities, and guidelines for AI assistants working on this project.

---

## Project Overview

A mobile-first weather app that validates a user's location, fetches a forecast from Open-Meteo, and suggests an illustrated outfit based on current conditions. The UI is reactive — colors shift based on temperature and sky conditions.

---

## Agents

### 1. Location Agent
**Responsibility:** Validate user input and resolve it to coordinates.

- Accepts a free-text city or location name from the user
- Calls the Open-Meteo Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
- Confirms the place exists and returns: confirmed name, country, latitude, longitude
- If no result is found, returns a clear error for the UI to display
- Should handle ambiguous names (e.g. "Springfield") by returning the top result with country context

**API:** `GET https://geocoding-api.open-meteo.com/v1/search?name={query}&count=1`

---

### 2. Weather Agent
**Responsibility:** Fetch and structure forecast data for a confirmed location.

- Accepts latitude and longitude from the Location Agent
- Calls the Open-Meteo Forecast API: `https://api.open-meteo.com/v1/forecast`
- Fetches:
  - Current conditions (temperature, weather code, wind speed, precipitation)
  - Hourly forecast (next 24 hours minimum)
  - Daily forecast (7 days)
- Returns structured data ready for the UI and Outfit Agent to consume

**Key variables to request:**
```
current=temperature_2m,weather_code,wind_speed_10m,precipitation
hourly=temperature_2m,weather_code,precipitation_probability
daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum
```

---

### 3. Outfit Agent
**Responsibility:** Map weather conditions to an outfit suggestion.

- Accepts current temperature and weather code from the Weather Agent
- Applies hardcoded outfit logic based on temperature bands and conditions
- Returns an outfit label (e.g. "Light jacket + jeans") and an illustration key (e.g. `outfit_mild_rainy`)
- Rain and wind conditions layer on top of the base temperature outfit

**Outfit Logic:**

| Temperature | Base Outfit Key |
|---|---|
| Below 5°C | `outfit_freezing` |
| 5–14°C | `outfit_cold` |
| 15–20°C | `outfit_mild` |
| 21–27°C | `outfit_warm` |
| Above 28°C | `outfit_hot` |

**Modifiers:**
- `+rainy` → add waterproof layer + umbrella
- `+windy` → add windbreaker

---

### 4. UI / Theme Agent
**Responsibility:** Determine the visual theme based on weather conditions.

- Accepts weather code and temperature from the Weather Agent
- Returns a theme token (background color, accent color, text color)
- Theme shifts based on the combination of sky condition + temperature

**Theme Map:**

| Condition | Theme Token |
|---|---|
| Sunny + hot | `theme_sunny_hot` |
| Sunny + cold | `theme_sunny_cold` |
| Cloudy + mild | `theme_cloudy_mild` |
| Rainy + cold | `theme_rainy_cold` |
| Stormy | `theme_stormy` |
| Night | `theme_night` |

---

## Agent Communication Flow

```
User Input (city name)
        ↓
[Location Agent] → confirmed name + coordinates
        ↓
[Weather Agent] → structured forecast data
        ↙               ↘
[Outfit Agent]     [UI/Theme Agent]
outfit key +        theme token +
label               color palette
        ↘               ↙
           UI renders
```

---

## Guidelines for AI Agents Working on This Project

- **Mobile-first:** All UI output should be designed for narrow viewports (~390px) first
- **No API keys:** Open-Meteo is fully free and open — do not add authentication layers
- **Outfit logic is hardcoded:** Do not attempt to generate outfit suggestions dynamically via AI — use the defined bands and keys
- **Illustrations are static assets:** Each outfit key maps to a pre-existing SVG illustration — do not generate images at runtime
- **Error handling is required:** Every agent must handle and surface failures gracefully (invalid location, network error, missing data)
- **Keep it simple:** This is a clean, minimal app — resist adding features beyond the defined scope without explicit instruction
