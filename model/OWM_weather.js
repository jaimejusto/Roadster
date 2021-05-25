const formatWeather = (weather) => {
    let forecast = [];
    const today = new Date();
    const month = today.getMonth() + 1;

    for (let day = 0; day < weather.length; day++) {

        let date = today.getDate() + day;

        let daily_data = {
            "Date": `${month}/${date}`,
            "High": `${weather[day].temp.max} F`,
            "Low": `${weather[day].temp.min} F`,
            "Humidity": `${weather[day].humidity} %`,
            "Chance_of_Rain": `${weather[day].pop} %`
        };
        forecast.push(daily_data);
    }

    return forecast;
};

module.exports = {
    formatWeather
};