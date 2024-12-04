module.exports = async function (context, req) {
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

        const weatherData = await response.json();

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                temperature: Math.round(weatherData.main.temp),
                condition: weatherData.weather[0].main,
                location: weatherData.name,
                description: weatherData.weather[0].description,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed
            }
        };
    } catch (error) {
        context.log.error('Error fetching weather data:', error);
        context.res = {
            status: 500,
            body: { error: error.message || "Failed to fetch weather data" }
        };
    }
}; 