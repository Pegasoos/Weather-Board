
//create search hitory element on each search that get same results as original search
//search history renders buttons in #search-history div
function searchHistory(){
    var cityName = $(".weather-search").val();
    var historyButton = $("<button>").val(cityName);
    $(historyButton).text($(historyButton).val());
    $(historyButton).addClass("weather-button bg-info border border-1 border-light");
    $(historyButton).attr("id", "history-search")
    var searchHistoryDiv = $("#search-history")
    $(historyButton).on("click", weatherSearch)
    $(searchHistoryDiv).append(historyButton);
}

//use weather search class to trigger search on both original search and generated buttons, above code to synchronize button text and code
//weather-button, weather-search now classes for button generation
function generateResults(response){
    var fiveDayHeader = $("<h1>").text("Five Day Forecast:")
    var fiveDayDiv = $("#five-day")
    $(fiveDayDiv).append(fiveDayHeader)
    for(i=0;i<40;i+=8){
        //creating elements to display information for each day and appending them to 5 Day Forecast Div
        var startDate = parseInt(response.list[i].dt);
        var newDate = new Date(startDate * 1000).toLocaleDateString("en-US");
        var weatherIcon = $("<img>").attr("src", `http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png`)
        var dateHeading = $("<h2>").text(`${newDate}`)
        var iconP = $("<p>").append(weatherIcon)
        var forecastTemp = $("<p>").text(`Temp: ${response.list[i].main.temp}°F`)
        var forecastHumidity = $("<p>").text(`Humidity: ${response.list[i].main.humidity}%`)
        var forecastCol = $("<div>").addClass("col-md-2 m-3 bg-primary text-white rounded-1");
        $(forecastCol).append(dateHeading).append(iconP).append(forecastTemp).append(forecastHumidity);
        $(fiveDayDiv).append(forecastCol);
    }
}
 function weatherSearch(){
     //clears results display
    $("#currentForecast").empty()
    var fiveDayDiv = $("#five-day")
    $(fiveDayDiv).empty();
    //cityName value gotten in different ways depending on whether a search history button or typed search was used
    if($(this).is("#history-search")){
        var cityName = $(this).val();
    }
    else{
        var cityName = $(".weather-search").val();
    }

    localStorage.setItem("lastSearch", cityName)

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
            var currentUVI = $("<p>").text(`UV Index: `)
            var uviSpan = $("<span>").text(`${response.current.uvi}`) 
            if(response.current.uvi < 3){
                $(uviSpan).addClass("bg-success rounded-1")
            }
            else if(response.current.uvi > 6){
                $(uviSpan).addClass("bg-danger rounded-1")
            }
            else{
                $(uviSpan).addClass("bg-warning rounded-1")
            }
            $(currentUVI).append(uviSpan)
            //add class to current uvi that changes color based on number
            $("#currentForecast").append(resultHeader).append(currentTemp).append(currentWindSpeed).append(currentHumidity).append(currentUVI)
        })
    })
    //condition to prevent search history buttons from replicating themselves
    if($(this).is("#search-button")){
    searchHistory();
    }
}
$(document).ready(function(){
    $(".weather-search").val(localStorage.getItem("lastSearch"));
    weatherSearch()
})
$(".weather-button").on("click", weatherSearch)