// store api query url for both location search and five-day forecast for that location, get object by location
// log object determine how store all the information we need
// append to div
// current weather by city api format: api.openweathermap.org/data/2.5/weather?q=${cityName}&appid={API key}
// 5 day forecast by city name api format: api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid={API key}
// For temperature in Fahrenheit use units=imperial
//create search hitory element on each search that get same results as original search
function renderSearch(){

}

 function weatherSearch(){
     //clear results display
    $("#currentForecast").empty()

    var cityName = $("#weather-search").val();
    //replace weather query with one ca query using lat and lon
    var forecastQueryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=9e04f2b6c335750c8cfb2144be29b60f`
    //call to get 5 day forecast object
    $.ajax({
        url: forecastQueryURL,
        method: "GET"
    }).then(function(response){
        //retrieve lat and lon from 5 day to do one call search for uv data
        console.log(response)
        var searchLon = JSON.stringify(response.city.coord.lon)
        var searchLat = JSON.stringify(response.city.coord.lat)
        var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${searchLat}&lon=${searchLon}&exclude=hourly&units=imperial&appid=9e04f2b6c335750c8cfb2144be29b60f`
        console.log(queryURL)
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response)
            var resultHeader = $("<h1>").text(cityName)
            var currentIcon = $("<img>").attr("src", `http://openweathermap.org/img/wn/${response.current.weather[0].icon}.png`)
            $(resultHeader).append(currentIcon)
            var currentTemp = $("<p>").text(`Temperature: ${response.current.temp}`)
            var currentWindSpeed = $("<p>").text(`Wind Speed: ${response.current.wind_speed}`)
            var currentHumidity = $("<p>").text(`Humidity: ${response.current.humidity}`)
            var currentUVI = $("<p>").text(`UV Index: ${response.current.uvi}`)
            $("#currentForecast").append(resultHeader).append(currentTemp).append(currentWindSpeed).append(currentHumidity).append(currentUVI)
        })
    })
    
}
//cors fix C:\Program Files (x86)\Google\Chrome\Application, chrome.exe --disable-web-security --user-data-dir=c:\my-chrome-data\data
$("#weather-button").on("click", weatherSearch)
$("#weather-button").on("click", renderSearch)