import { HttpRequest } from "@azure/functions";

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

async function httpTrigger(
    context: any, 
    req: HttpRequest
): Promise<void> {
    const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const city = 'Helsinki';

    context.log('API Key exists:', !!OPENWEATHER_API_KEY);

    if (!OPENWEATHER_API_KEY) {
        context.res = {
            status: 500,
            body: { error: "API key not configured" }
        };
        return;
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

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: weatherResponse
        };
    } catch (error) {
        context.log.error('Error fetching weather data:', error);
        context.res = {
            status: 500,
            body: { error: error instanceof Error ? error.message : "Failed to fetch weather data" }
        };
    }
}

export default httpTrigger; 