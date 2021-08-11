const weatherTemperature = document.querySelector('.weather__temperature');
const weatherDescription = document.querySelector('.weather__description');
const weatherHumidity = document.querySelector('.weather__humidity');
const weatherFeelsLike = document.querySelector('.weather__feels-like');
const searchBar = document.querySelector('.search__bar');
const searchBtn = document.querySelector('.search__btn');
const errorDiv = document.querySelector('.error');
const weatherLocation = document.querySelector('.weather__location');
const weatherIcon = document.querySelector('#icon');

const api = config.API_KEY;

function formatWeatherData(data, city) {
  return {
    temperature: data.main.temp,
    tempFarenheit: ((data.main.temp * (9 / 5)) + 32),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    feelsLike: data.main['feels_like'],
    feelsLikeFarenheit: ((data.main['feels_like'] * (9 / 5)) + 32),
    city: city,
  }
}

function displayErrorInDOM(err) {
  errorDiv.textContent = err;
}

function renderWeatherData(data) {
  weatherTemperature.textContent = `${data.temperature.toFixed(1)}°C`;
  weatherTemperature.dataset.farenheit = data.tempFarenheit;
  weatherTemperature.dataset.celsius = data.temperature;
  weatherDescription.textContent = data.description;
  weatherHumidity.textContent = `${data.humidity}% humidity`;
  weatherFeelsLike.textContent = `Feels like ${data.feelsLike.toFixed(1)}°C`;
  weatherFeelsLike.dataset.farenheit = data.feelsLikeFarenheit;
  weatherFeelsLike.dataset.celsius = data.feelsLike;
  weatherLocation.textContent = data.city;
}

function removeRenderedWeatherData() {
  const allWeatherDivs = document.querySelectorAll('.weather > div');
  allWeatherDivs.forEach((div) => {
    div.textContent = "";
  });
}

function changeIcon(data) {
  if (data.description.includes('cloud')) {
    weatherIcon.className = 'fas fa-cloud';
  } else if (data.description.includes('clear')) {
    weatherIcon.className = 'fas fa-sun';
  } else if (data.description.includes('mist')) {
    weatherIcon.className = 'fas fa-smog';
  } else if (data.description.includes('rain')) {
    weatherIcon.className = 'fas fa-cloud-rain';
  } else {
    weatherIcon.className = 'fas fa-sun';
  }
}

function searchByEnterKey(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchBtn.click();
  }
}

searchBar.addEventListener('keyup', (e) => {
    searchByEnterKey(e);
});


searchBtn.addEventListener('click', () => {
  const searchQuery = searchBar.value;
  if (searchQuery === "") {
    const err = new Error("City name must be entered");
    displayErrorInDOM(err.message);
    throw err;
  } else {
    promiseFetch(searchQuery);
  }
  searchBar.blur();
});


function changeTempDisplay() {
  if (weatherTemperature.textContent.includes('C')) {
    weatherTemperature.textContent = `${parseInt(weatherTemperature.dataset.farenheit).toFixed(1)}°F`;
    weatherFeelsLike.textContent = `Feels like ${parseInt(weatherFeelsLike.dataset.farenheit).toFixed(1)}°F`;
  } else {
    weatherTemperature.textContent = `${parseInt(weatherTemperature.dataset.celsius).toFixed(1)}°C`;
    weatherFeelsLike.textContent = `Feels like ${parseInt(weatherFeelsLike.dataset.celsius).toFixed(1)}°C`;
  }
}

weatherTemperature.addEventListener('click', changeTempDisplay);


// ### PROMISE VERSION ###

function promiseFetch(cityName) {

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&id=524901&appid=${api}`, { mode: 'cors' })
  .then((response) => {
    if (!response.ok) {
      throw new Error('City not found');
    } 
    return response.json();
  })
  .then((response) => {
    searchBar.value = "";
    const weatherData = formatWeatherData(response, cityName);
    renderWeatherData(weatherData);
    changeIcon(weatherData);
    errorDiv.textContent = "";
  })
  .catch((error) => {
    // Update div with error
    // Check for fetch fail (as opposed to status fail thrown above)
    if (error.message === 'Failed to fetch') {
      displayErrorInDOM('Unable to reach server, please check your connection');
    } else {
      displayErrorInDOM(error.message);
    }
  });
}

promiseFetch('Japan');



// ### ASYNC/AWAIT VERSION

async function asyncFetch(cityName) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&id=524901&appid=${api}`, { mode: 'cors' });

    if (!response.ok) {
      console.log(`Error: ${cityName} not found`);
      throw new Error(response.status);
    }

    const APIData = await response.json();
    const weatherData = formatWeatherData(APIData, cityName);

    renderWeatherData(weatherData);
    changeIcon(weatherData);
    errorDiv.textContent = "";
    searchBar.value = "";

  } catch (error) {
    // Update div with error
    removeRenderedWeatherData();
    if (error.message === 'Failed to fetch') {
      displayErrorInDOM('Unable to reach server, please check your connection');
    } else {
      displayErrorInDOM(error.message);
    }
  }
}