const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;

app.use(cors()); // Boleh diakses dari frontend mana saja
app.use(express.json());

app.get('/weather', async (req, res) => {
  const city = req.query.city;

  // Validasi query
  if (!city) {
    return res.status(400).json({ error: 'Parameter ?city= wajib diisi.' });
  }

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
          lang: 'id', // bahasa Indonesia
        },
      }
    );

    const data = response.data;

    // Format respons custom
    res.json({
      kota: data.name,
      suhu: data.main.temp + '°C',
      cuaca: data.weather[0].description,
      kelembapan: data.main.humidity + '%',
      kecepatan_angin: data.wind.speed + ' m/s',
      koordinat: data.coord,
    });
  } catch (err) {
    // Tangani error respons API
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: `Kota "${city}" tidak ditemukan.` });
    }
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Gagal mengambil data cuaca.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
