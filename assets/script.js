// store api query url for both location search and five-day forecast for that location, get object by location
// log object determine how store all the information we need
// append to div
// current weather by city api format: api.openweathermap.org/data/2.5/weather?q=${cityName}&appid={API key}
// 5 day forecast by city name api format: api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid={API key}
// For temperature in Fahrenheit use units=imperial

 function weatherSearch(){
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
        })
    })
    
}
//cors fix C:\Program Files (x86)\Google\Chrome\Application, chrome.exe --disable-web-security --user-data-dir=c:\my-chrome-data\data
$("#weather-button").on("click", weatherSearch)