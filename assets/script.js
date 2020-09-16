// Checks to make sure entire document is loaded before jQuery fires.
$(document).ready(function () {
  // Momentjs current date.
  var dateTime = moment().format("MM/DD/YYYY");
  // variable populated history list with past searches or empty array.
  var historyList = JSON.parse(localStorage.getItem("historyList")) || [];
  // Function populated recent searches into a list using an for loop
  function displayRecentList() {
    var historyEl = $("#searchHistory");
    historyEl.html("");
    for (var i = 0; i < historyList.length; i++) {
      // generates button of each search
      var historyBtn = $("<button>")
        .addClass("searchItem btn btn-light col-sm-12")
        .text(historyList[i]);
      // On click of each button is calls the search button function again.
      historyBtn.on("click", function (event) {
        getCurrentWeather(event.target.innerText);
      });
      historyEl.prepend(historyBtn);
    }
  }
  displayRecentList();
  // On click of search button, this function is triggered beginning all of the ajax calls to pull API data into my html skeleton.
  function getCurrentWeather(cityName) {
    // Search inputs are set to lower case to prevent duplicate buttons.
    if (historyList.indexOf(cityName.toLowerCase()) === -1) {
      historyList.push(cityName.toLowerCase());
      // Search info is stored in local storage.
      localStorage.setItem("historyList", JSON.stringify(historyList));
      displayRecentList();
    }
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
      console.log(response);
      var currentIcon = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/wn/" +
          response.weather[0].icon +
          "@2x.png"
      );
      console.log(currentIcon);
      // Drilling for specific info located in the API
      $("#currentCity")
        .text(response.name + "  -  " + "(" + dateTime + ") ")
        .append(currentIcon);
      $("#currentTemp").text(
        "Temperature:  " + Math.floor(response.main.temp) + " °F"
      );
      $("#currentHumid").text("Humidity:  " + response.main.humidity + "%");
      $("#currentWind").text("Wind Speed:  " + response.wind.speed + " mph");
      // pulling information needed to create the UV Index URL.
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
        $("#currentUV").text("UV Index:  ").append(spanUV);
        // Conditionals that apply UV Index background color.
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
      // AJAX call pulling 5 day forecast info from API
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
        // array for populating unique card classes upon generation.
        var forecastID = [0, 1, 2, 3, 4, 5];
        $("#fiveDay").html("");
        $("#fiveDayTitle").html("");
        $("#fiveDayTitle").append("5-day Forecast:");
        // For loop that generates and appends weather cards onto page.
        for (var i = 1; i < 6; i++) {
          var dayIcon = response.list[i * 8 - 1].weather[0].icon;
          // manipulating the DOM to generate html and assign css classes to cards.
          var forecastCard = $("<div>").addClass(
            "col-lg-2 card shadow p-3 mb-5 rounded forecast" + forecastID[i]
          );
          var datePlus = moment().add(i, "days").format("MM/DD/YYYY");
          var foreDate = $("<h7>").text(datePlus);
          var foreIcon = $("<img>").attr(
            "src",
            "http://openweathermap.org/img/wn/" + dayIcon + "@2x.png"
          );
          var foreTemp = $("<p>").text(
            Math.floor(response.list[i * 8 - 1].main.temp) + " °F"
          );
          var foreHumid = $("<p>").text(
            "Humidity:" + response.list[i * 8 - 1].main.humidity + "%"
          );

          $("#fiveDay").append(forecastCard);
          $(".forecast" + forecastID[i]).append(
            foreDate,
            foreIcon,
            foreTemp,
            foreHumid
          );
        }
      });
    });
  }
  // onClick function that listens for City search submission.
  $("#searchBtn").on("click", function () {
    var cityName = $("#searchText").val();
    getCurrentWeather(cityName);
  });
});
