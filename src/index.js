let week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let rain = ["Rain", "Drizzle", "Thunderstorm"];

let apiKey = "dbe7323377a0b709d184afc4f1ae31a9";

function checkWeather(description) {
  let img = document.getElementById("main-image");
  if (description === "Clear") {
    img.src = "images/Sun_Outline.svg";
    img.alt = "Sun and clouds";
  } else if (rain.includes(description)) {
    img.src = "images/Rain_Outline.svg";
    img.alt = "Rainy";
  } else if (description === "Snow") {
    img.src = "images/Snow_Outline.svg";
    img.alt = "Snowy";
  } else {
    img.src = "images/Mountain_Outline.svg";
    img.alt = "Clouds";
  }
}

function getForecast(coordinates) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;
  axios.get(url).then(displayForecast);
}

function fah(degree) {
  let fahrenheit = degree * 1.8 + 32;
  return Math.round(fahrenheit);
}

function cel(degree) {
  let celcius = (degree - 32) / 1.8;
  return Math.round(celcius);
}

function convertToF(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp");
  document.querySelector("#fahrenheit").classList.add("active");
  document.querySelector("#celcius").classList.remove("active");
  let val = temperature.innerText;
  if (val) {
    temperature.innerHTML = fah(val);
  }
}

function convertToC(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp");
  document.querySelector("#fahrenheit").classList.remove("active");
  document.querySelector("#celcius").classList.add("active");
  let val = temperature.innerText;
  if (val) {
    temperature.innerHTML = cel(val);
  }
}

function full(data) {
  if (data < 10) {
    return "0" + data;
  } else return data;
}

function f() {
  let fLink = document.querySelector("#fahrenheit");
  fLink.addEventListener("click", convertToF);
}

function c() {
  let cLink = document.querySelector("#celcius");
  cLink.addEventListener("click", convertToC);
}

function time() {
  let element = document.querySelector("#display-time");
  let now = new Date();
  let day = now.getDay();
  let hour = full(now.getHours());
  let minutes = full(now.getMinutes());
  element.innerHTML = `${week[day]} ${hour}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function changeCity(response) {
  response.preventDefault();
  let search = document.querySelector("#inputCity");
  if (search.value) {
    let city = search.value.trim();
    city = city.toLowerCase();
    let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;
    axios.get(url).then(function (feedback) {
      let temp = feedback.data.main.temp;
      let res = Math.round(temp);
      let resCity = feedback.data.name;
      let desc = feedback.data.weather[0].main;

      let humidityElement = document.querySelector("#humidity");
      let windElement = document.querySelector("#wind");
      humidityElement.innerHTML = `Humidity: ${feedback.data.main.humidity}%`;
      windElement.innerHTML = `Wind: ${Math.round(
        feedback.data.wind.speed
      )}km/h`;
      checkWeather(desc);
      let h1 = document.querySelector("h1");
      h1.innerHTML = `${resCity}`;
      let h2 = document.querySelector("h2");
      h2.innerHTML = `${desc},
            <span><span id="temp">${res}</span>°</span>
            <a href="#" id="celcius" class="degLink active">C</a
            ><span id="line"> | </span
            ><a href="#" id="fahrenheit" class="degLink">F</a>`;
      getForecast(feedback.data.coord);
      time();
      f();
      c();
    });
  }
  search.value = null;
}

function getCoord(response) {
  let lat = response.coords.latitude;
  let long = response.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&appid=${apiKey}`;
  axios.get(url).then(function (resp) {
    let temp = resp.data.main.temp;
    let res = Math.round(temp);
    let name = resp.data.name;
    let desc = resp.data.weather[0].main;
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");
    humidityElement.innerHTML = `Humidity: ${resp.data.main.humidity}%`;
    windElement.innerHTML = `Wind: ${Math.round(resp.data.wind.speed)}km/h`;
    checkWeather(desc);
    let h1 = document.querySelector("h1");
    h1.innerHTML = `${name}`;
    let h2 = document.querySelector("h2");
    h2.innerHTML = `
            ${desc}, <span><span id="temp">${res}</span>°</span>
            <a href="#" id="celcius" class="degLink active">C</a
            ><span id="line"> | </span
            ><a href="#" id="fahrenheit" class="degLink">F</a>`;
    getForecast(resp.data.coord);
    time();
    f();
    c();
  });
}

function getLocationTemp(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCoord);
}

function defaultCity() {
  let city = "Kyiv";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(url).then(function (response) {
    let h2 = document.querySelector("h2");
    let desc = response.data.weather[0].main;
    let res = Math.round(response.data.main.temp);
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");
    humidityElement.innerHTML = `Humidity: ${response.data.main.humidity}%`;
    windElement.innerHTML = `Wind: ${Math.round(response.data.wind.speed)}km/h`;
    checkWeather(desc);
    h2.innerHTML = `${desc}, <span><span id="temp">${res}</span>°</span>
            <a href="#" id="celcius" class="degLink active">C</a
            ><span id="line"> | </span
            ><a href="#" id="fahrenheit" class="degLink">F</a>`;
    getForecast(response.data.coord);
    time();
    f();
    c();
  });
}

function displayForecast(response) {
  let forecastElement = document.querySelector(".forecast");
  let forecast = response.data.daily;
  let forecastHTML = '<div class="row">';
  forecast.forEach(function (day, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` <div class="col">
              ${formatDay(day.dt)}
              <br />
              <span><img src="http://openweathermap.org/img/wn/${
                day.weather[0].icon
              }@2x.png" alt="${
          day.weather[0].description
        }" id="forecast-icon" /></span>
              <br />
              <span id="day-max">${Math.round(
                day.temp.max
              )}</span>° | <span id="day-min">${Math.round(
          day.temp.min
        )}</span>°
            </div>`;
    }
  });
  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

defaultCity();
time();

let form = document.querySelector(".form");
form.addEventListener("submit", changeCity);

let currentButton = document.querySelector("#current");
currentButton.addEventListener("click", getLocationTemp);
