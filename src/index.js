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

let apiKey = "dbe7323377a0b709d184afc4f1ae31a9";

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
      let iconID = feedback.data.weather[0].icon;
      let src = `http://openweathermap.org/img/wn/${iconID}@2x.png`;
      let iconElement = document.querySelector("#icon");
      iconElement.setAttribute("alt", desc);
      iconElement.setAttribute("src", src);
      checkWeather(desc);
      let h1 = document.querySelector("h1");
      h1.innerHTML = `${resCity}`;
      let h2 = document.querySelector("h2");
      h2.innerHTML = `${desc},
            <span><span id="temp">${res}</span>°</span>
            <a href="#" id="celcius" class="degLink active">C</a
            ><span id="line"> | </span
            ><a href="#" id="fahrenheit" class="degLink">F</a>`;
      time();
      f();
      c();
    });
  }
  search.value = null;
}

// function changeCity(event) {
//   event.preventDefault();
//   navigator.geolocation.getCurrentPosition(userCity);
// }

function getCoord(response) {
  let lat = response.coords.latitude;
  let long = response.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&appid=${apiKey}`;
  axios.get(url).then(function (resp) {
    let temp = resp.data.main.temp;
    let res = Math.round(temp);
    let name = resp.data.name;
    let desc = resp.data.weather[0].main;
    let iconID = resp.data.weather[0].icon;
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");
    humidityElement.innerHTML = `Humidity: ${resp.data.main.humidity}%`;
    windElement.innerHTML = `Wind: ${Math.round(resp.data.wind.speed)}km/h`;
    let src = `http://openweathermap.org/img/wn/${iconID}@2x.png`;
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute("src", src);
    iconElement.setAttribute("alt", desc);
    checkWeather(desc);
    let h1 = document.querySelector("h1");
    h1.innerHTML = `${name}`;
    let h2 = document.querySelector("h2");
    h2.innerHTML = `
            ${desc}, <span><span id="temp">${res}</span>°</span>
            <a href="#" id="celcius" class="degLink active">C</a
            ><span id="line"> | </span
            ><a href="#" id="fahrenheit" class="degLink">F</a>`;
    time();
    f();
    c();
    // let resDegree = document.querySelector("span#temp");
    // resDegree.innerHTML = res;
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
    let iconID = response.data.weather[0].icon;
    let src = `http://openweathermap.org/img/wn/${iconID}@2x.png`;
    let iconElement = document.querySelector("#icon");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");
    humidityElement.innerHTML = `Humidity: ${response.data.main.humidity}%`;
    windElement.innerHTML = `Wind: ${Math.round(response.data.wind.speed)}km/h`;
    iconElement.setAttribute("alt", desc);
    iconElement.setAttribute("src", src);
    checkWeather(desc);
    h2.innerHTML = `${desc}, <span><span id="temp">${res}</span>°</span>
            <a href="#" id="celcius" class="degLink active">C</a
            ><span id="line"> | </span
            ><a href="#" id="fahrenheit" class="degLink">F</a>`;
    time();
    f();
    c();
  });
}

defaultCity();
time();
// f();
// c();

let form = document.querySelector(".form");
form.addEventListener("submit", changeCity);

let currentButton = document.querySelector("#current");
currentButton.addEventListener("click", getLocationTemp);
