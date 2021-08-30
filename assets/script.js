
//create search hitory element on each search that get same results as original search
function generateResults(response){
    for(i=0;i<40;i+=8){
        // need date, icon, temp, and humidity- 
        //call to get 5 day forecast object, list array items response.list[0, 8, 16, 24, 32].main.temp/humidity to get next 5 days, 
        //response.list[0, 8, 16, 24, 32].weather[0].icon to get weather symbol
        // response.lost[0, 8, 16, 24, 32].dt to get date for conversion
        // create div.addClass("col-md-2").append(all the weather info)
        var cityName = $("#weather-search").val();
        var fiveDayDiv = $("#five-day")
        var startDate = parseInt(response.list[i].dt);
        var newDate = new Date(startDate * 1000).toLocaleDateString("en-US");
        var dateHeading = $("<h2>").text(`${cityName} (${newDate})`)
        $(fiveDayDiv).append(dateHeading)
    }
}
 function weatherSearch(){
     //clears results display
    $("#currentForecast").empty()

    var cityName = $("#weather-search").val();
    
    var forecastQueryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=9e04f2b6c335750c8cfb2144be29b60f`
    
    $.ajax({
        url: forecastQueryURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
        //try passing response to function that handles loop?
        generateResults(response)
           
        
        //retrieve lat and lon from 5 day to do one call search for uv data
        var searchLon = JSON.stringify(response.city.coord.lon)
        var searchLat = JSON.stringify(response.city.coord.lat)
        var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${searchLat}&lon=${searchLon}&exclude=hourly&units=imperial&appid=9e04f2b6c335750c8cfb2144be29b60f`
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response)
            var startDate = parseInt(response.current.dt);
            var newDate = new Date(startDate * 1000).toLocaleDateString("en-US");
            var resultHeader = $("<h1>").text(`${cityName} (${newDate})`)
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