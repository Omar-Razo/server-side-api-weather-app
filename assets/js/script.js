let apiKey = "e7d709054173c8d786359abf189001df";
let fetchButton = document.getElementById("fetch-btn")
let locationInput = document.getElementById("queryParams")
let savedSearches = JSON.parse(localStorage.getItem("savedSearch")) ?? [];
let previousSearches = document.querySelector("#previous-searches")
if (savedSearches !== null) {
    let lastSearch = savedSearches[(savedSearches.length - 1)]
    // requestWeatherData(lastSearch)
}

// first i need to fetch lon/lat data for city
function requestCityCoords(event) {
    event.preventDefault()

    let cityInput = locationInput.value;
    cityQuery = cityInput.split(",");
    strippedQuery = []
    for (i = 0; i < cityQuery.length; i++) {
        strippedQuery.push(cityQuery[i].trim())
    }

    let requestCoordsUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${strippedQuery[0]},${strippedQuery[1]},${strippedQuery[2]}&limit=1&appid=${apiKey}`

    

    // create button from search
    let btn = document.createElement("button")
    btn.className = "button has-background-grey my-3"
    btn.textContent = locationInput.value
    previousSearches.appendChild(btn)

    fetch(requestCoordsUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            // save search
            let searchResult = {
                htmlEl: btn,
                lat: data[0].lat,
                lon: data[0].lon
            }

            savedSearches.push(searchResult)
            console.log("saved Searches:", savedSearches)
            locationInput.value = ""
            localStorage.setItem("savedSearch", JSON.stringify(savedSearches))
            // send coords to weatherdata
            requestWeatherData(searchResult)
        })
    
}
// event listener
fetchButton.addEventListener("click", requestCityCoords)

// Todays elements
let todaysLoc = document.querySelector("#todays-loc")
let todaysDate = document.querySelector("#todays-date")
let todaysTemp = document.querySelector("#todays-temp")
let todaysWind = document.querySelector("#todays-wind")
let todaysHumid = document.querySelector("#todays-humid")

// forecast elements
let forecastDates = document.querySelectorAll("#forecast-date")
let forecastIcons = document.querySelectorAll("#forecast-icon")
let forecastTemps = document.querySelectorAll("#forecast-temp")
let forecastWinds = document.querySelectorAll("#forecast-wind")
let forecastHumids = document.querySelectorAll("#forecast-humid")
console.log(forecastDates)


function requestWeatherData(coords) {

    let requestWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${apiKey}`

    fetch(requestWeatherUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            console.log("weather:", data)
            let forecastObjects = [data.list[6], data.list[14], data.list[22], data.list[30], data.list[38]]
            console.log(forecastObjects)

            todaysLoc.textContent = data.city.name
            todaysDate.textContent = data.list[0].dt_txt
            todaysTemp.textContent = `Temp: ${data.list[0].main.temp} \xB0F`
            todaysWind.textContent = `Wind: ${data.list[0].wind.speed} MPH`
            todaysHumid.textContent = `Humidity: ${data.list[0].main.humidity} %`

            for (let i = 0; i < forecastObjects.length; i++) {
                forecastDates[i].textContent = forecastObjects[i].dt_txt
                forecastIcons[i].textContent = forecastObjects[i].weather[1]
                forecastTemps[i].textContent = `Temp: ${forecastObjects[i].main.temp} \xB0F`
                forecastWinds[i].textContent = `Wind: ${forecastObjects[i].wind.speed} MPH`
                forecastHumids[i].textContent = `Humidity: ${forecastObjects[i].main.humidity} %`
            }
        })
}