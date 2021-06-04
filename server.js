const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

require('dotenv').config();
const rootRoute = require("./routes/root");
const weatherRoute = require("./routes/weather");
const geocodeRoute = require("./routes/geocode");
const weatherAdviceRoute = require("./routes/weatherAdvice");
const app = express();

app.use(express.static('scripts'));
app.use(express.static('views'));
app.use(express.static('styles'));
app.use(express.json());

app.use("/", rootRoute);
app.use("/weather", weatherRoute);
app.use("/geocode", geocodeRoute);
app.use("/weatherAdvice", weatherAdviceRoute);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`);
})