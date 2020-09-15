console.log("Hello Twitter World");
// Checks to make sure entire document is loaded before jQuery fires.
$(document).ready(function () {
  var dateTime = moment().format("MM/DD/YYYY");

  // onClick function that listens for City search submission.
  $("#searchBtn").on("click", function () {
    var cityName = $("#searchText").val();
    // This is my API Key
    var APIKey = "f074459fc12a2702e389a5a7750c8cbb";
    // URL we need to query the database
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey +
      "&units=imperial";

    // AJAX call to pull information from weather API
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // console.log(queryURL);
      // console.log(response);

      // Drilling for specific info located in the API
      $("#currentCity").text(response.name + "  -  " + "(" + dateTime + ")");
      $("#currentTemp").text(
        "Temperature:  " + Math.floor(response.main.temp) + " °F"
      );
      $("#currentHumid").text("Humidity:  " + response.main.humidity + "%");
      $("#currentWind").text("Wind Speed:  " + response.wind.speed + " mph");

      var lon = response.coord.lon;
      var lat = response.coord.lat;
      var queryURLuv =
        "https://api.openweathermap.org/data/2.5/uvi?appid=" +
        APIKey +
        "&lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial";
      // AJAX call for UV info only
      $.ajax({
        url: queryURLuv,
        method: "GET",
      }).then(function (response) {
        var UVIndex = response.value;
        var spanUV = $("<span>").addClass("UVColored").text(UVIndex);
        console.log(UVIndex);
        console.log(spanUV);
        $("#currentUV").text("UV Index:  ").append(spanUV);
        if (UVIndex < 3) {
          spanUV.attr("id", "low");
        } else if (UVIndex > 2 && UVIndex < 6) {
          spanUV.attr("id", "med");
        } else if (UVIndex > 5 && UVIndex < 8) {
          spanUV.attr("id", "high");
        } else if (UVIndex > 7 && UVIndex < 11) {
          spanUV.attr("id", "veryHigh");
        } else if (UVIndex > 10) {
          spanUV.attr("id", "extremelyHigh");
        }
      });
      var cityID = response.id;
      var queryURLFiveDay =
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        cityID +
        "&appid=" +
        APIKey +
        "&units=imperial";

      $.ajax({
        url: queryURLFiveDay,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        // console.log(queryURLFiveDay);
        var forecastID = [0, 1, 2, 3, 4, 5];
        
        for (var i = 1; i < 6; i++) {
          // console.log([i]);
          var dayIcon = response.list[i].weather[0].icon;

          var forecastCard = $("<div>").addClass(
            "col-sm-2 card shadow p-3 mb-5 rounded forecast" + forecastID[i]
          );
          var datePlus = moment().add(i, "days").format("MM/DD/YYYY");
          var foreDate = $("<h7>").text(datePlus);
          var foreIcon = $("<img>").attr(
            "src",
            "http://openweathermap.org/img/wn/" + dayIcon + "@2x.png"
          );
          var foreTemp = $("<p>").text(
            Math.floor(response.list[i].main.temp) + " °F"
          );
          var foreHumid = $("<p>").text(
            "Humidity:" + response.list[i].main.humidity + "%"
          );

          $("#fiveDay").append(forecastCard);
          $(".forecast" + forecastID[i]).append(foreDate);
          $(".forecast" + forecastID[i]).append(foreIcon);
          $(".forecast" + forecastID[i]).append(foreTemp);
          $(".forecast" + forecastID[i]).append(foreHumid);
        }
      });
    });
  });
});
