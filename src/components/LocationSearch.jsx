import React, { useState } from 'react';
import { fetchCoordinates } from '../utils/weather';

export default function LocationSearch({ onLocationFound, onError }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await fetchCoordinates(query);
      onLocationFound(data);
      setQuery('');
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="location-search" onSubmit={handleSearch}>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search any city..."
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? '...' : '🔍'}
      </button>
    </form>
  );
}
