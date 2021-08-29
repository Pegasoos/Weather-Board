// store api query url for both location search and five-day forecast for that location, get object by location
// log object determine how store all the information we need
// append to div
// current weather by city api format: api.openweathermap.org/data/2.5/weather?q=${cityName}&appid={API key}
// 5 day forecast by city name api format: api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid={API key}
// For temperature in Fahrenheit use units=imperial
//create search hitory element on each search that get same results as original search
function renderSearch(){

}
let unixDate = 1630195631;

let date = new Date(unixDate * 1000);

let year = date.getFullYear();

let month = date.getMonth();

let day = date.getDate();

console.log(`(${month}/${day}/${year})`)

 function weatherSearch(){
     //clear results display
    $("#currentForecast").empty()

    var cityName = $("#weather-search").val();
    //replace weather query with one ca query using lat and lon
    var forecastQueryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=9e04f2b6c335750c8cfb2144be29b60f`
    //call to get 5 day forecast object, list array items response.list[0, 8, 16, 24, 32].main.temp/humidity to get next 5 days, 
    //response.list[0, 8, 16, 24, 32].weather[0].icon to get weather symbol
    //create div.addClass("col-md-2").append(all the weather info)
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
            var startDate = parseInt(response.current.dt);
            var newDate = new Date(startDate * 1000);
            var year = newDate.getFullYear();
            var month = newDate.getMonth();
            var day = newDate.getDate();
            var resultHeader = $("<h1>").text(`${cityName} (${month}/${day}/${year})`)
            var currentIcon = $("<img>").attr("src", `http://openweathermap.org/img/wn/${response.current.weather[0].icon}.png`)
            $(resultHeader).append(currentIcon)
            var currentTemp = $("<p>").text(`Temperature: ${response.current.temp}°F`)
            var currentWindSpeed = $("<p>").text(`Wind Speed: ${response.current.wind_speed} MPH`)
            var currentHumidity = $("<p>").text(`Humidity: ${response.current.humidity}%`)
            var currentUVI = $("<p>").text(`UV Index: ${response.current.uvi}`)
            $("#currentForecast").append(resultHeader).append(currentTemp).append(currentWindSpeed).append(currentHumidity).append(currentUVI)
        })
    })
    
}
//cors fix C:\Program Files (x86)\Google\Chrome\Application, chrome.exe --disable-web-security --user-data-dir=c:\my-chrome-data\data
$("#weather-button").on("click", weatherSearch)
$("#weather-button").on("click", renderSearch)