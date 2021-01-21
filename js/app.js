let long;
let lat;
let apiURL;
let celsius = 'metric';
let fahrenheit = 'imperial';
let currentUnit = celsius;
let tempDegree = document.querySelector('.temperature-degree');
let locationh2 = document.querySelector('.location-timezone');
let temperatureDescrip = document.querySelector('.temperature-description');
let tempSection = document.querySelector('.temperature-div');
let realFeelH4 = document.querySelector('.real_feel');
let userCity = document.querySelector('.city-input');
let apiKey = 'c6a49299a5e1eb1e6da1648cd191af74';

window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      apiURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=${currentUnit}&appid=${apiKey}`;

      fetch(apiURL)
        .then(parseResponse)
        .then(populatePageElementsWithAPIInfo)
        .then(setIcons);
    });
  }
});

window.addEventListener('change', () => {
  if (userCity !== '') {
    apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${userCity.value}&units=${currentUnit}&appid=${apiKey}`;
    fetch(apiURL)
      .then(parseResponse)
      .then(populatePageElementsWithAPIInfo)
      .then(setIcons);
  }
});

tempSection.addEventListener('click', () => {
  fetch(apiURL)
    .then(parseResponse)
    .then(getTempData)
    .then(toggleCelsiusFarenheit);
});

function getWeatherDescription(simplifiedDescription) {
  const possibleWeatherDescriptions = {
    cloud: 'CLOUDY',
    rain: 'RAIN',
    day: 'CLEAR_DAY',
    sun: 'CLEAR_DAY',
    clear: 'CLEAR_DAY',
    haze: 'FOG',
    snow: 'SNOW',
  };

  const weatherKeys = Object.keys(possibleWeatherDescriptions);
  for (let key of weatherKeys) {
    if (simplifiedDescription.includes(key)) {
      let value = possibleWeatherDescriptions[key].toUpperCase();
      simplifiedDescription = value;
      return simplifiedDescription;
    }
  }
}

function setUnit(unit) {
  if (unit === 'metric') {
    return 'metric';
  } else {
    return 'imperial';
  }
}

function setDegreesUnitToH2(unit) {
  if (unit === 'metric') {
    return 'C';
  } else {
    return 'F';
  }
}

function covertValueCelsiusToFarenheit(celsiusValue) {
  let fahrenheitValue = celsiusValue * (9 / 5) + 32;
  return Math.floor(fahrenheitValue);
}

const toggleCelsiusFarenheit = ({ temp, feels_like }) => {
  celsiusTemp = Math.floor(temp);
  feelsLikeCelsius = Math.floor(feels_like);
  farenheitTemp = covertValueCelsiusToFarenheit(celsiusTemp);
  feelsLikeFarenheit = covertValueCelsiusToFarenheit(feelsLikeCelsius);

  if (tempDegree.textContent.includes('C')) {
    unit = fahrenheit;
    tempDegree.textContent = `${farenheitTemp}${setDegreesUnitToH2(`${unit}`)}`;
    realFeelH4.textContent = `But if you ask me it feels more like ${feelsLikeFarenheit}${setDegreesUnitToH2(
      `${unit}`
    )}`;
  } else {
    unit = celsius;
    tempDegree.textContent = `${celsiusTemp}${setDegreesUnitToH2(`${unit}`)}`;
    realFeelH4.textContent = `But if you ask me it feels more like ${feelsLikeCelsius}${setDegreesUnitToH2(
      `${unit}`
    )}`;
  }
};

const populatePageElementsWithAPIInfo = ({ weather, main, sys, name }) => {
  const weatherDescription = capitalizeFirstLetter(weather[0].description);
  const locationLocal = name;
  const locationCountry = sys;
  const { feels_like, temp } = main;
  const { country } = locationCountry;
  const celsiusTemp = Math.floor(temp);
  const feelsLikeCelsius = Math.floor(feels_like);

  tempDegree.textContent = `${celsiusTemp}${setDegreesUnitToH2(
    `${currentUnit}`
  )}`;
  realFeelH4.textContent = `But if you ask me it feels more like ${feelsLikeCelsius}${setDegreesUnitToH2(
    `${currentUnit}`
  )}`;
  locationh2.textContent = `${locationLocal}, ${country}`;
  temperatureDescrip.textContent = `${weatherDescription}`;

  return Promise.resolve({ weather, main, sys, name });
};

function setIconsMain(simplifiedDescription, iconID) {
  const skycons = new Skycons({ color: 'white' });
  const currentIcon = getWeatherDescription(simplifiedDescription);
  skycons.play();
  return skycons.set(iconID, Skycons[currentIcon]);
}

const setIcons = (data) => {
  simplifiedDescription = data.weather[0].main.toLowerCase();
  setIconsMain(simplifiedDescription, document.querySelector('.icon'));
};

function parseResponse(response) {
  return response.json();
}

const getTempData = ({ main }) => {
  const { feels_like, temp } = main;
  return Promise.resolve({ feels_like, temp });
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
