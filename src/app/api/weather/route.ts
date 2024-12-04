import { NextResponse } from 'next/server';

interface WeatherResponse {
    temperature: number;
    condition: string;
    location: string;
    description: string;
    humidity: number;
    windSpeed: number;
}

interface OpenWeatherResponse {
    main: {
        temp: number;
        humidity: number;
    };
    weather: Array<{
        main: string;
        description: string;
    }>;
    name: string;
    wind: {
        speed: number;
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'Helsinki';
    const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

    if (!OPENWEATHER_API_KEY) {
        return NextResponse.json(
            { error: "API key not configured" },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`Weather API responded with status ${response.status}`);
        }

        const weatherData: OpenWeatherResponse = await response.json();

        const weatherResponse: WeatherResponse = {
            temperature: Math.round(weatherData.main.temp),
            condition: weatherData.weather[0].main,
            location: weatherData.name,
            description: weatherData.weather[0].description,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed
        };

        return NextResponse.json(weatherResponse);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch weather data" },
            { status: 500 }
        );
    }
}
