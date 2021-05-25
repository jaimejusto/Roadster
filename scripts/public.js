mapboxgl.accessToken = "pk.eyJ1IjoiamFpbWVqdXN0byIsImEiOiJja29pY3F0ZW0xM2J1MnZwMWkwNWRvaXNnIn0.QSIh4jhy9wO_bKht1UC-iA";

navigator.geolocation.getCurrentPosition(
    successLocation, 
    errorLocation, 
    { enableHighAccuracy: true }
);

function successLocation(position) {

    setupMap([position.coords.longitude, position.coords.latitude]);
};

function errorLocation() {
    setupMap([-4.42762, 50.38330]);
};

function setupMap(center) {
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v10",
        center: center, // starting position
        zoom: 14,
    });
    
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "top-right");

    const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken
    });
    map.addControl(directions, "top-left");

    map.on("load", function() {
        directions.setOrigin(center);
    })

    directions.on("destination", function() {
        const destinationObject = directions.getDestination();
        let destinationCoords = destinationObject.geometry.coordinates;
        getDestinationWeather(destinationCoords);

    })

};

const getDestinationWeather = async (coords) => {
    const lat = coords[1].toString();
    const lon = coords[0].toString();
    const url = new URL(window.location.href);
    const api_url = url + `weather/${lat},${lon}`;
    const weather = await fetch(api_url);
    displayForecast(weather);
};

const displayForecast = (forecast) => {
    let destinationID = document.getElementById("destination");
    destinationID.innerText = "Destination 7 Day Forecast";

    let table = document.createElement("table");
    let row = document.createElement("tr");
    
};

