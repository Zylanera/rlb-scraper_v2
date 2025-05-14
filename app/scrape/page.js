'use client'
import { useState, useEffect } from 'react';

export default function ScrapePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleScrape = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/scrape/shop/osp', { method: 'POST' });

      const data = await response.json();
      if (data.success) {
        setMessage('Scraping abgeschlossen!');
      } else {
        setMessage('Fehler beim Scraping!');
      }
    } catch (error) {
      setMessage('Es gab ein Problem bei der Anfrage: ' + error);
    }
  };

  return (
    <div>
      <button onClick={handleScrape} disabled={loading}>
        {loading ? `Lädt... ` : 'Starte Scraping'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
