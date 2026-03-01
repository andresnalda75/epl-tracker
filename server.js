const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const API_KEY = '3966f7fa5a62439e9a84c5ddbc41dae0';

app.get('/api/{*path}', async (req, res) => {
  const rawPath = Array.isArray(req.params.path) ? req.params.path.join('/') : req.params.path;
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

app.listen(3000, '0.0.0.0', () => {
  console.log('EPL Tracker running at http://localhost:3000/epl-tracker.html');
});
