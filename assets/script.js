console.log("Hello Twitter World");
$(document).ready(function () {

  $("#searchBtn").on("click", function () {
    var cityName = $("#searchText").val();
  // This is our API key. Add your own API key between the ""
  var APIKey = "f074459fc12a2702e389a5a7750c8cbb";
  // Here we are building the URL we need to query the database
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey + "&units=imperial";

  // We then created an AJAX call
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // Create CODE HERE to Log the queryURL
    console.log(queryURL);
    // Create CODE HERE to log the resulting object
    console.log(response);
    $("#currentCity").text(response.name);
    $("#currentTemp").text(response.main.temp);
    $("#currentHumid").text(response.main.humidity);
    $("#currentWind").text(response.wind.speed);
    

  });

  });
});
