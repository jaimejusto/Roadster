const fetch = require("node-fetch");
const OWM_API_KEY = process.env.OWM_API_KEY;

const geocodeController = {
    home: async (req, res) => {
        const lat_lon = req.params.lat_lon.split(",");
        const lat = lat_lon[0];
        const lon = lat_lon[1];

        const OWM_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OWM_API_KEY}`;
        const results = await fetch(OWM_URL);
        const location = await results.json();
        const city = location[0];
        res.status(200).send(city);
    }
};

module.exports = geocodeController;