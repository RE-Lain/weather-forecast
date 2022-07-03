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
  let val = temperature.innerText;
  if (val) {
    temperature.innerHTML = fah(val);
  }
}

function convertToC(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp");
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
      console.log(feedback.data.weather[0].icon);
      let resCity = feedback.data.name;
      let desc = feedback.data.weather[0].main;
      console.log(desc);
      checkWeather(desc);
      let h1 = document.querySelector("h1");
      h1.innerHTML = `${resCity}`;
      let h2 = document.querySelector("h2");
      h2.innerHTML = `${desc},
            <span><span id="temp">${res}</span>°</span>
            <a href="#" id="celcius" class="degLink">C</a
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
  console.log(`Latitude: ${lat}\nLongitude: ${long}`);
  let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&appid=${apiKey}`;
  axios.get(url).then(function (resp) {
    let temp = resp.data.main.temp;
    let res = Math.round(temp);
    console.log(resp);
    console.log(res);
    let name = resp.data.name;
    let desc = resp.data.weather[0].main;
    checkWeather(desc);
    console.log(desc);
    let h1 = document.querySelector("h1");
    h1.innerHTML = `${name}`;
    let h2 = document.querySelector("h2");
    h2.innerHTML = `
            ${desc},
            <span><span id="temp">${res}</span>°</span>
            <a href="#" id="celcius" class="degLink">C</a
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

time();
f();
c();

let form = document.querySelector(".form");
form.addEventListener("submit", changeCity);

let currentButton = document.querySelector("#current");
currentButton.addEventListener("click", getLocationTemp);
