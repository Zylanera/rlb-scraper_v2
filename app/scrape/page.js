'use client'
import { useState } from 'react';
import "../styles/globals.css";

export default function ScrapePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleScrape = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://0.0.0.0:5000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Scraping abgeschlossen! Die Daten wurden erfolgreich extrahiert.');
      } else {
        setMessage('Fehler beim Scraping!');
      }
    } catch (error) {
      setMessage('Es gab ein Problem bei der Anfrage: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scrape-page">
      <h1>Scraping-Tool</h1>
      <div className="scrape-container">
        <button onClick={handleScrape} disabled={loading} className="scrape-button">
          {loading ? 'Lädt...' : 'Starte Scraping'}
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
