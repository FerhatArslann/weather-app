'use client';

import { useState } from 'react';
import { Cloud, Droplets, Wind } from 'lucide-react';

// Määritellään säätietojen tyyppi TypeScriptille
interface WeatherData {
  temp: number;      // Lämpötila celsiuksena
  humidity: number;  // Ilmankosteus prosentteina
  windSpeed: number; // Tuulennopeus m/s
}

// Suomen kaupungit, joiden säätietoja voidaan hakea
const CITIES = ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku'];

export default function Weather() {
  // Tilamuuttujat React hookien avulla
  const [weather, setWeather] = useState<WeatherData | null>(null);  // Säätiedot
  const [loading, setLoading] = useState(false);                     // Latausanimaation tila
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);       // Valittu kaupunki

  // Tulostetaan konsoliin tieto API-avaimen olemassaolosta
  console.log('API Key exists:', !!process.env.NEXT_PUBLIC_WEATHER_API_KEY);

  // Funktio säätietojen hakemiseen OpenWeatherMap API:sta
  const fetchWeather = async () => {
    setLoading(true);
    try {
      // Muodostetaan API-kutsu valitulle kaupungille
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity},
      FI&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`;
      
      console.log('Fetching URL:', url);

      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      // Tarkistetaan onnistuiko API-kutsu
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Muunnetaan vastaus JSON-muotoon
      const data = await response.json();
      console.log('API Response:', data);
      
      // Tarkistetaan että saatiin kaikki tarvittavat tiedot
      if (data.main && data.wind) {
        const weatherData = {
          temp: Math.round(data.main.temp * 10) / 10,        // Pyöristetään lämpötila yhteen desimaaliin
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 10) / 10   // Pyöristetään tuulennopeus yhteen desimaaliin
        };
        console.log('Processed weather data:', weatherData);
        setWeather(weatherData);
      } else {
        throw new Error('Virheellinen data API:sta');
      }
    } catch (error) {
      console.error('Virhe säädatan haussa:', error);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Käyttöliittymän renderöinti
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Säätiedot</h1>
      
      {/* Kaupungin valinta ja hakupainike */}
      <div className="flex gap-4 mb-8">
        <select 
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-2 rounded-lg bg-blue-800/50 text-white border border-blue-700"
        >
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <button 
          onClick={fetchWeather}
          disabled={loading}
          className={`
            px-6 py-2 rounded-lg 
            ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
            transition-colors duration-200 shadow-lg
          `}
        >
          {loading ? 'Haetaan...' : 'Hae säätiedot'}
        </button>
      </div>

      {/* Säätietojen näyttäminen */}
      {weather && (
        <div className="mt-8 grid gap-6 text-xl max-w-md w-full">
          {/* Lämpötila */}
          <div className="flex items-center gap-4 bg-blue-800/30 p-6 rounded-lg shadow-lg">
            <Cloud className="w-8 h-8" />
            <span>Lämpötila: {weather.temp}°C</span>
          </div>
          
          {/* Ilmankosteus */}
          <div className="flex items-center gap-4 bg-blue-800/30 p-6 rounded-lg shadow-lg">
            <Droplets className="w-8 h-8" />
            <span>Kosteus: {weather.humidity}%</span>
          </div>
          
          {/* Tuulennopeus */}
          <div className="flex items-center gap-4 bg-blue-800/30 p-6 rounded-lg shadow-lg">
            <Wind className="w-8 h-8" />
            <span>Tuulennopeus: {weather.windSpeed} m/s</span>
          </div>
        </div>
      )}
    </div>
  );
}

