const dayOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthOfTheYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formatWeather = (forecast) => {
    let formatted_forecast = [];
    let date = new Date();
    const degrees = "&deg;";

    for (let day = 0; day < forecast.length - 1; day++) {
        let daily_weather_conditions = [];
        for (let i = 0; i < forecast[day].weather.length; i++) {
            let image_icon = forecast[day].weather[i].icon;
            let description = forecast[day].weather[i].description;
            let weather_conditions = {
                "Icon": `http://openweathermap.org/img/wn/${image_icon}@2x.png`,
                "Description": `${description.charAt(0).toUpperCase()}${description.slice(1)}.`
            };
            daily_weather_conditions.push(weather_conditions);
        }

        if (day != 0) {
            date.setDate(date.getDate() + 1);
        }
        
        let daily_data = {
            "Date": `${dayOfTheWeek[date.getDay()]}, ${monthOfTheYear[date.getMonth()]} ${date.getDate().toString().padStart(2, "0")}`,
            "High/Low": `${forecast[day].temp.max.toFixed(1)} / ${forecast[day].temp.min.toFixed(1)}${degrees}F`,
            "Morning": `${forecast[day].temp.morn.toFixed(1)}${degrees}F`,
            "Afternoon": `${forecast[day].temp.day.toFixed(1)}${degrees}F`,
            "Evening": `${forecast[day].temp.eve.toFixed(1)}${degrees}F`,
            "Night": `${forecast[day].temp.night.toFixed(1)}${degrees}F`,
            "Humidity": `${forecast[day].humidity}%`,
            "Chance_of_Rain": `${forecast[day].pop.toFixed(1) * 100}%`,
            "Weather": daily_weather_conditions
        };
        formatted_forecast.push(daily_data);
    }
    return formatted_forecast;
};

module.exports = {
    formatWeather
};