const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'epl-tracker.html'));
});

const API_KEY = '3966f7fa5a62439e9a84c5ddbc41dae0';

app.get('/api/*', async (req, res) => {
  const rawPath = req.params[0];
  const apiUrl = 'https://api.football-data.org/v4/' + rawPath;
  const query = new URLSearchParams(req.query).toString();
  const fullUrl = query ? apiUrl + '?' + query : apiUrl;

  console.log('Fetching:', fullUrl);

  try {
    const response = await fetch(fullUrl, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('EPL Tracker running on port ' + PORT);
});
