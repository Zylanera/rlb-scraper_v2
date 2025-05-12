const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 5000;

app.use(express.json());

app.post('/scrape', (req, res) => {
  console.log("⚙️ Starte externes Scraping...");
  exec('node ../osp-scraper.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Fehler beim Scraping:\n${stderr}`);
      return res.status(500).json({ success: false, error: stderr });
    }
    console.log(stdout);
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`🚀 Server läuft auf http://localhost:${port}`);
});
