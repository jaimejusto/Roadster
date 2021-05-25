const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const rootRoute = require("./routes/root");
const weatherRoute = require("./routes/weather");
const app = express();


//app.set("views", path.resolve(__dirname,'views')) 
//app.set("view engine", "pug");
app.use(express.static('scripts'));
app.use(express.static('views'));
app.use(express.static('styles'));
app.use(express.json());

app.use("/", rootRoute);
app.use("/weather", weatherRoute);



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`);
})