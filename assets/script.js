console.log("Hello Twitter World");
// Checks to make sure entire document is loaded before jQuery fires.
$(document).ready(function () {

  var dateTime = moment().format("dddd, MMMM Do");



  // onClick function that listens for City search submission.
  $("#searchBtn").on("click", function () {
    var cityName = $("#searchText").val();
  // This is my API Key
  var APIKey = "f074459fc12a2702e389a5a7750c8cbb";
  // URL we need to query the database
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey + "&units=imperial";

  // AJAX call to pull information from weather API
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(queryURL);
    console.log(response);

    // Drilling for specific info located in the API
    $("#currentCity").text(response.name + "  -  " + dateTime);
    $("#currentTemp").text("Temperature:  " + Math.floor(response.main.temp) + " °F");
    $("#currentHumid").text("Humidity:  " + response.main.humidity + "%");
    $("#currentWind").text("Wind Speed:  " +response.wind.speed + " mph");

    var lon = response.coord.lon;
    var lat = response.coord.lat;
    var queryURLuv = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
    // AJAX call for UV info only
    $.ajax({
      url: queryURLuv,
      method: "GET",
    }).then(function (response) {
      var currentUVEl = response.value;
    $("#currentUV").text("UV Index:  " + currentUVEl);
  });
  });

  });
});
