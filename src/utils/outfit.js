export function getOutfitSuggestion(temperature, weatherCode, windSpeed) {
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

  let isRainy = false;
  // WMO codes: 51-67, 80-82, 95-99 are rain/showers/thunderstorm
  if ((weatherCode >= 51 && weatherCode <= 67) || 
      (weatherCode >= 80 && weatherCode <= 82) || 
      (weatherCode >= 95 && weatherCode <= 99)) {
    isRainy = true;
    label += ' + waterproof layer/umbrella';
  }

  let isWindy = false;
  // 20km/h threshold
  if (windSpeed > 20) {
    isWindy = true;
    label += ' + windbreaker';
  }

  return { key: baseKey, label, isRainy, isWindy };
}
