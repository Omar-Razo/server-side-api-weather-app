let apiKey = "e7d709054173c8d786359abf189001df";
let sumbitArea = document.getElementById("input-form")
let locationInput = document.getElementById("queryParams")
let savedSearches = JSON.parse(localStorage.getItem("savedSearch")) ?? [];
let previousSearches = document.querySelector("#previous-searches")


// function to convert city input to coordinates
function requestCityCoords(event) {
    event.preventDefault()

    // take city input and split into pieces. 
    let cityInput = locationInput.value;
    cityQuery = cityInput.split(",");
    strippedQuery = []
    for (i = 0; i < cityQuery.length; i++) {
        strippedQuery.push(cityQuery[i].trim())
    }
    // plug split input into request url as parameters
    let requestCoordsUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${strippedQuery[0]},${strippedQuery[1]},${strippedQuery[2]}&limit=1&appid=${apiKey}`

    // fetch coordinates
    fetch(requestCoordsUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            // create button from search input 
            let btn = document.createElement("button")
            btn.className = "button has-background-grey my-3"
            btn.textContent = locationInput.value
            previousSearches.appendChild(btn)

            // save search result coords for later use as well as copy of btn made from search
            let searchResult = {
                searchText: locationInput.value,
                lat: data[0].lat,
                lon: data[0].lon
            }

            if (savedSearches.length === 10) {
                savedSearches.shift()
                savedSearches.push(searchResult)
            }
            else {
                savedSearches.push(searchResult)
            }
            console.log("saved Searches:", savedSearches)
            locationInput.value = ""
            localStorage.setItem("savedSearch", JSON.stringify(savedSearches))
            // send coords to weatherdata
            requestWeatherData(searchResult)
        })
    
}
// event listener
sumbitArea.addEventListener("submit", requestCityCoords)

// Todays elements
let todayContainer = document.querySelector("#today-container")
let todaysLoc = document.querySelector("#todays-loc")
let todaysIcon = document.querySelector("#todays-icon")
let todaysTemp = document.querySelector("#todays-temp")
let todaysWind = document.querySelector("#todays-wind")
let todaysHumid = document.querySelector("#todays-humid")

// forecast elements
let forecastContainer = document.querySelector("#five-day")
let forecastDates = document.querySelectorAll("#forecast-date")
let forecastIcons = document.querySelectorAll("#forecast-icon")
let forecastTemps = document.querySelectorAll("#forecast-temp")
let forecastWinds = document.querySelectorAll("#forecast-wind")
let forecastHumids = document.querySelectorAll("#forecast-humid")


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

            todaysLoc.textContent = `${data.city.name} on ${data.list[0].dt_txt}`
            todaysIcon.setAttribute("src", `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`)
            todaysTemp.textContent = `Temp: ${data.list[0].main.temp} \xB0F`
            todaysWind.textContent = `Wind: ${data.list[0].wind.speed} MPH`
            todaysHumid.textContent = `Humidity: ${data.list[0].main.humidity} %`

            for (let i = 0; i < forecastObjects.length; i++) {
                forecastDates[i].textContent = forecastObjects[i].dt_txt
                forecastIcons[i].setAttribute("src", `http://openweathermap.org/img/w/${forecastObjects[i].weather[0].icon}.png`)
                forecastTemps[i].textContent = `Temp: ${forecastObjects[i].main.temp} \xB0F`
                forecastWinds[i].textContent = `Wind: ${forecastObjects[i].wind.speed} MPH`
                forecastHumids[i].textContent = `Humidity: ${forecastObjects[i].main.humidity} %`
            }

            todayContainer.setAttribute("style", "opacity: 1;")
            forecastContainer.setAttribute("style", "opacity: 1;")
        })
}

function displaySavedResults() {
    for (i = 0; i < savedSearches.length; i++) {
        let btn = document.createElement("button")
        btn.className = "button has-background-grey my-3"
        btn.textContent = savedSearches[i].searchText
        previousSearches.appendChild(btn)
    }
}

displaySavedResults()

previousSearches.addEventListener("click", function(e) {
    
    let matchedSearch = savedSearches.find(el => el.searchText === e.target.textContent)
    requestWeatherData(matchedSearch)
} )
