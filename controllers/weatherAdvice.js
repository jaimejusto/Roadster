const fetch = require("node-fetch");

const weatherAdviceController = {
    home: async (req, res) => {
        const temp = req.params.temp;

        const weatherAdviceURL = `http://jaaguil2.pythonanywhere.com/${temp}`;
        const results = await fetch(weatherAdviceURL);
        const weatherAdvice = await results.json();
        res.status(200).json(weatherAdvice);
    }
};

module.exports = weatherAdviceController;