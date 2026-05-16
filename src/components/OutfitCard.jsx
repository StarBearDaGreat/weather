import React from 'react';

export default function OutfitCard({ outfit }) {
  if (!outfit) return null;

  const imagePath = `/images/${outfit.key}.png`;

  return (
    <div className="outfit-card">
      <h3>What to wear</h3>
      <div className="outfit-image-container">
        <img src={imagePath} alt={outfit.label} className="outfit-image" />
      </div>
      <p className="outfit-label">{outfit.label}</p>
    </div>
  );
}
