module.exports = async function (context, req) {
    const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const city = 'Helsinki'; // Voit muuttaa tämän tai ottaa parametrina

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Weather API call failed');
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
            body: { error: "Failed to fetch weather data" }
        };
    }
}; 