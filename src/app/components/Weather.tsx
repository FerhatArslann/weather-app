'use client';

import { useState } from 'react';
import { Cloud, Droplets, Wind, Search } from 'lucide-react';

// Suomen isoimmat kaupungit
const FINNISH_CITIES = [
    'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 
    'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori'
];

interface WeatherData {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    description: string;
    location: string;
}

export default function Weather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState(FINNISH_CITIES[0]);

    const fetchWeather = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/weather?city=${selectedCity}`);
            if (!response.ok) throw new Error('Virhe säätietojen haussa');
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Virhe:', error);
            setWeather(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">Säätiedot</h1>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-blue-800/50 border border-blue-700 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {FINNISH_CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>

                    <button
                        onClick={fetchWeather}
                        disabled={loading}
                        className={`
                            flex items-center justify-center gap-2 px-6 py-2 rounded-lg
                            ${loading ? 'bg-blue-800/50' : 'bg-blue-600 hover:bg-blue-700'}
                            transition-colors duration-200 disabled:cursor-not-allowed
                        `}
                    >
                        <Search size={20} />
                        {loading ? 'Haetaan...' : 'Hae säätiedot'}
                    </button>
                </div>

                {weather && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="text-2xl font-semibold text-center mb-6">
                            {weather.location}
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="bg-blue-800/30 p-6 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <Cloud className="w-6 h-6 text-blue-400" />
                                    <span className="text-lg">Lämpötila</span>
                                </div>
                                <div className="text-3xl font-bold mt-2">
                                    {weather.temperature}°C
                                </div>
                                <div className="text-blue-300 mt-1">
                                    {weather.description}
                                </div>
                            </div>

                            <div className="bg-blue-800/30 p-6 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <Droplets className="w-6 h-6 text-blue-400" />
                                    <span className="text-lg">Kosteus</span>
                                </div>
                                <div className="text-3xl font-bold mt-2">
                                    {weather.humidity}%
                                </div>
                            </div>

                            <div className="bg-blue-800/30 p-6 rounded-xl backdrop-blur-sm md:col-span-2">
                                <div className="flex items-center gap-3">
                                    <Wind className="w-6 h-6 text-blue-400" />
                                    <span className="text-lg">Tuulennopeus</span>
                                </div>
                                <div className="text-3xl font-bold mt-2">
                                    {weather.windSpeed} m/s
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

