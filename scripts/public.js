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
        zoom: 15,
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

    directions.on("route", async function() {
        console.log("getting destination");
        const destinationObject = directions.getDestination();
        const coordinates = destinationObject.geometry.coordinates;
        const [destinationLat, destinationLon] = getLatitudeLongitude(coordinates);
        const destinationInfo = await getDestinationInfo(destinationLat, destinationLon);
        localStorage.setItem("destination", JSON.stringify(destinationInfo));
        displayForecast(destinationInfo);
    })
};

const getDestinationInfo = async (latitude, longitude) => {
    /**
     * Retrieves destination weather forecast and city name.
     */
    const weather = await returnApiDestinationResults("weather", latitude, longitude);
    const destination = await returnApiDestinationResults("geocode", latitude, longitude);
    return {"weather": weather, "city": destination.name, "state": destination.state};
};

const getLatitudeLongitude = (coords) => {
    /**
     * Returns latitude and longitude as array of strings.
     */
    return [coords[1].toString(), coords[0].toString()];
};

const returnApiDestinationResults = async (route, latitude, longitude) => {
    const api_url = baseURL() + `${route}/${latitude},${longitude}`;
    const results = await fetch(api_url);
    return results.json();
};

const returnWeatherAdvice = async (temp) => {
    const api_url = baseURL() + `weatherAdvice/${temp}`;
    const results = await fetch(api_url);
    return results.json();
};

const baseURL = () => {
    return new URL (window.location.href);
};

const removedWhiteSpace = (str) => {
    const noWhiteSpaces = str.replace(/\s/g, "");
    return noWhiteSpaces;
};
const destinationCityUpdated = (destinationCity) => {
    /**
     * True == destination updated. False == destination same as previous provided.
     */
    return (!document.getElementById(removedWhiteSpace(destinationCity)));
};

const firstDestinationCityNotProvided = () => {
    return (document.getElementsByClassName("accordion")[0] == undefined);    
};

const displayWeatherAccordion = (numDays, forecast, location_city, location_state) => {
    let weatherDiv = document.getElementById("weather");
    let accordionDiv = createAccordionDiv(numDays, location_city, location_state);

    for (let i = 0; i < numDays; i++) {
        let accordionItem = createAccordionItem(forecast, i, location_city);
        accordionDiv.appendChild(accordionItem);
        weatherDiv.appendChild(accordionDiv);       
    }
};

const getForecastSettings = () => {
    /**
     * Returns settings if found. Else returns null.
     */
    return localStorage.getItem("forecastSettings");
};

const setForecastSettings = (numDays) => {
    localStorage.setItem("forecastSettings", numDays.toString());
};

const forecastDaysSettings = (forecastNumberOfDays) => {
    setForecastSettings(forecastNumberOfDays);
    let destinationInfo = localStorage.getItem("destination");
    let destinationObj = JSON.parse(destinationInfo);
    removeForecast();
    displayWeatherAccordion(forecastNumberOfDays, destinationObj.weather, destinationObj.city, destinationObj.state);
};

const createMenuItem = (numDays, numDaysSetting) => {
    let menuItem = document.createElement("li");
    let menuItemButton = createElementWithClass("button", "dropdown-item");
    if (numDays == numDaysSetting) {
        menuItemButton = createElementWithClass("button", "dropdown-item disabled");
        menuItemButton.setAttribute("aria-disabled", "true");
    }

    menuItemButton.setAttribute("type", "button");
    menuItemButton.addEventListener("click", () => forecastDaysSettings(numDays));
    menuItemButton.innerText = `View only ${numDays} days`;
    menuItem.appendChild(menuItemButton);
    return menuItem;
};
const createSettingsMenu = (numDaysSetting) => {
    let settingsMenu = createElementWithClass("ul", "dropdown-menu");
    settingsMenu.setAttribute("aria-labelledby", "dropdownButton");

    let forecastSettingValues = [3, 5, 7];
    for (let numDays of forecastSettingValues) {
        let menuItem = createMenuItem(numDays, numDaysSetting);
        settingsMenu.appendChild(menuItem);
    }

    return settingsMenu;
};

const createSettingsButton = () => {
    let settingsButton = createElementWithClass("button", "btn btn-dark btn-sm dropdown-toggle");
    settingsButton.id = "dropdownButton";
    settingsButton.setAttribute("type", "button");
    settingsButton.setAttribute("data-bs-toggle", "dropdown");
    settingsButton.setAttribute("aria-expanded", "false");
    settingsButton.innerText = "Settings";
    return settingsButton;


};
const createForecastSettings = (numDays) => {
    let settingsDiv = createElementWithClass("div", "dropdown");
    let settingsButton = createSettingsButton();
    let settingsMenu = createSettingsMenu(numDays);
    let settingsChildren = [settingsButton, settingsMenu];
    addChildren(settingsDiv, settingsChildren);
    return settingsDiv;
};

const displayForecast = (destinationInfo) => {
    const weather = destinationInfo.weather;
    const city = destinationInfo.city;
    const state = destinationInfo.state;

    if (firstDestinationCityNotProvided()) {
        setForecastSettings(7);
        displayWeatherAccordion(7, weather, city, state);
    }
    else if (destinationCityUpdated(city)) {
        let numDays = getForecastSettings();
        removeForecast();
        displayWeatherAccordion(numDays, weather, city, state);
    }
};

const createAccordionDiv = (numDays, location_city, location_state) => {
    let accordionDiv = createElementWithClass("div", "accordion");
    accordionDiv.id = removedWhiteSpace(location_city);         // remove white spaces from location

    let locationHeader = document.createElement("h3");
    locationHeader.id = "numDaysForecastHeader";
    locationHeader.innerText = `${numDays}-day forecast for ${location_city}, ${location_state}`;
    let forecastSettingsMenu = createForecastSettings(numDays);
    locationHeader.appendChild(forecastSettingsMenu);

    accordionDiv.appendChild(locationHeader);
    return accordionDiv;
};

const addChildren = (parent, children) => {
    for (let child of children) {
        parent.appendChild(child);
    }
    return parent;
 };

const createAccordionItem = (forecast, i, location) => {
    const forecastData = {
                            "forecast": forecast[i],
                            "location": location
    };
    let accordionItem = createElementWithClass("div", "accordion-item");
    let accordionHeader = createAccordionHeader(forecastData.forecast, i);
    let accordionBody = createAccordionBody(forecastData, i);
    let accordionItemChildren = [accordionHeader, accordionBody];
    addChildren(accordionItem, accordionItemChildren);
    return accordionItem;  
};

const createElementWithClass = (element_type, class_name) => {
    let element = document.createElement(element_type);
    element.className = class_name;
    return element;
};

const createAccordionHeader = (forecast, rowNum) => {
    let accordionHeader = createElementWithClass("h2", "accordion-header");
    const formattedDate = removedWhiteSpace(forecast.Date);
    accordionHeader.id = formattedDate;

    let button = createAccordionHeaderButton(rowNum);
    
    let dateDiv = createElementWithClass("div", "date");
    dateDiv.innerText = forecast.Date;
    let highLowDiv = createElementWithClass("div", "highLow");
    let weatherIcon = `<img src=${forecast.Weather[0].Icon} class=weatherIcon>`;
    highLowDiv.innerHTML = weatherIcon + forecast["High/Low"];
    
    let buttonChildren = [dateDiv, highLowDiv];
    addChildren(button, buttonChildren);
    accordionHeader.appendChild(button);
    return accordionHeader;
};

const createAccordionHeaderButton = (rowNum) => {
    let button = createElementWithClass("button", "accordion-button collapsed");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#collapse${rowNum}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `collapse${rowNum}`);
    return button;
};

const insertDailyBreakdownTable = (data) => {
    let dailyTempsDiv = createElementWithClass("div", "daily-breakdown");
    let table = createBreakdownTable(data.location, data.forecast.Date);
    let tableRows = fillBreakdownTableRows(data);
    addChildren(table, tableRows);
    dailyTempsDiv.appendChild(table);
    return dailyTempsDiv;
};

const createBreakdownTable = (location, date) => {
    let table = createElementWithClass("table", "table table-sm table-borderless");
    table.id = `${removedWhiteSpace(location)}-${removedWhiteSpace(date)}-breakdown`;
    return table;
};

const fillBreakdownTableRows = (data) => {
    const timeframes = ["Morning", "Afternoon", "Evening", "Night"];
    let headerRow = document.createElement("tr");
    let tempRow = document.createElement("tr");
    for (let timeframe of timeframes) {
        let th = document.createElement("th");
        th.innerText = timeframe;

        let td = document.createElement("td");
        td.innerHTML = data.forecast[timeframe];
        headerRow.appendChild(th);
        tempRow.appendChild(td);
    }
    return [headerRow, tempRow];
};

const createBreakdownHeader = (weather, temp) => {
    let descriptions = [];
    let intTemp = parseInt(temp);
    
    for (let i = 0; i < weather.length; i++) {
        descriptions.push(weather[i].Description);
    }
    let breakdownHeader = createElementWithClass("h6", "breakdownHeader");
    returnWeatherAdvice(intTemp)
        .then( advice => {
            console.log(advice);
            breakdownHeader.innerText = `${descriptions.join(" ")} ${advice}` ;
        });
    return breakdownHeader;
};

const createBreakdownBody = (weather) => {
    let breakdownBody = createElementWithClass("p", "breakdownBody");
    breakdownBody.innerHTML = `Chance of rain: ${weather.Chance_of_Rain} <br> Humidity: ${weather.Humidity}`;
    return breakdownBody;
};
const createAccordionBody = (data, rowNum) => {
    let bodyDiv = createElementWithClass("div", "accordion-collapse collapse");
    bodyDiv.id = `collapse${rowNum}`;
    
    bodyDiv.setAttribute("aria-labelledby", removedWhiteSpace(data.forecast.Date));
    bodyDiv.setAttribute("data-bs-parent", `#${removedWhiteSpace(data.location)}`);

    let accordionBody = createElementWithClass("div", "accordion-body");
    let breakdownHeader = createBreakdownHeader(data.forecast.Weather, data.forecast.Afternoon);
    let breakdownBody = createBreakdownBody(data.forecast);
    let breakdownTable = insertDailyBreakdownTable(data);
    let accordionStuff = [breakdownHeader, breakdownBody, breakdownTable];
    addChildren(accordionBody, accordionStuff);
    bodyDiv.appendChild(accordionBody);  
    return bodyDiv; 
};

const removeForecast = () => {
    let accordion = document.getElementsByClassName("accordion")[0];
    accordion.remove();
};

