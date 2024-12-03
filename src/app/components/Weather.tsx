'use client';

import { useState } from 'react';
import { Cloud, Droplets, Wind } from 'lucide-react';

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = '5309e69dbbaf1da39e155616e1abc343';
  const CITY = 'Helsinki';

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeather({
        temp: Math.round(data.main.temp * 10) / 10,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 10) / 10
      });
    } catch (error) {
      console.error('Virhe säädatan haussa:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Säätiedot - {CITY}</h1>
      <button 
        onClick={fetchWeather}
        disabled={loading}
        className={`
          px-6 py-3 text-lg rounded-lg 
          ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
          transition-colors duration-200 shadow-lg
        `}
      >
        {loading ? 'Haetaan...' : 'Hae säätiedot'}
      </button>

      {weather && (
        <div className="mt-12 grid gap-8 text-xl">
          <div className="flex items-center gap-4 bg-blue-800/30 p-6 rounded-lg shadow-lg">
            <Cloud className="w-8 h-8" />
            <span>Lämpötila: {weather.temp}°C</span>
          </div>
          
          <div className="flex items-center gap-4 bg-blue-800/30 p-6 rounded-lg shadow-lg">
            <Droplets className="w-8 h-8" />
            <span>Kosteus: {weather.humidity}%</span>
          </div>
          
          <div className="flex items-center gap-4 bg-blue-800/30 p-6 rounded-lg shadow-lg">
            <Wind className="w-8 h-8" />
            <span>Tuulennopeus: {weather.windSpeed} m/s</span>
          </div>
        </div>
      )}
    </div>
  );
}