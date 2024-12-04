'use client';

import { useState } from 'react';

// Määritellään WeatherData tyyppi
interface WeatherData {
    temperature: number;
    condition: string;
    location: string;
    description: string;
    humidity: number;
    windSpeed: number;
}

export default function Home() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchWeather = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/weather');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch weather data');
            }
            
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Sää App</h1>
            
            <button 
                onClick={fetchWeather}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? 'Ladataan...' : 'Hae säätiedot'}
            </button>

            {error && (
                <div className="mt-4 text-red-500">
                    Virhe: {error}
                </div>
            )}

            {weather && (
                <div className="mt-4">
                    <p>Lämpötila: {weather.temperature}°C</p>
                    <p>Sää: {weather.condition}</p>
                    <p>Sijainti: {weather.location}</p>
                    <p>Kuvaus: {weather.description}</p>
                    <p>Kosteus: {weather.humidity}%</p>
                    <p>Tuulen nopeus: {weather.windSpeed} m/s</p>
                </div>
            )}
        </div>
    );
}
