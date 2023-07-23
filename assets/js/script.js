let apiKey = "e7d709054173c8d786359abf189001df";
let fetchButton = document.getElementById("fetch-btn")
let locationInput = document.getElementById("queryParams")

// first i need to fetch lon/lat data for city


function requestCityCoords(event) {
    event.preventDefault()

    let cityInput = locationInput.value;
    cityQuery = cityInput.split(",");
    strippedQuery = []
    for (i = 0; i < cityQuery.length; i++) {
        strippedQuery.push(cityQuery[i].trim())
    }

    let requestCoordsUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${strippedQuery[0]},${strippedQuery[1]},${strippedQuery[2]}&limit=&appid=${apiKey}`

    fetch(requestCoordsUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            console.log("coords:", data)
            requestWeatherData(data)
        })
    
}

fetchButton.addEventListener("click", requestCityCoords)

// requestCityCoords()

function requestWeatherData(data) {
    let returnedWeatherData = data[0]

    let requestWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${returnedWeatherData.lat}&lon=${returnedWeatherData.lon}&appid=${apiKey}`

    fetch(requestWeatherUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            console.log("weather:", data)
        })
}