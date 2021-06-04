const fetch = require("node-fetch");
const OWM_API_KEY = process.env.OWM_API_KEY;
const weatherModel = require("../model/OWM_weather");

const weatherController = {
    home: async (req, res) => {
        const lat_lon = req.params.lat_lon.split(",");
        const lat = lat_lon[0];
        const lon = lat_lon[1];

        const OWM_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,current,hourly&units=imperial&appid=${OWM_API_KEY}`;
        const results = await fetch(OWM_URL);
        const weather = await results.json();
        
        const forecast = weatherModel.formatWeather(weather.daily);
        res.status(200).send(forecast);
    }
};

module.exports = weatherController;