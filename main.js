const weatherTemperature = document.querySelector('.weather__temperature');
const weatherDescription = document.querySelector('.weather__description');
const weatherHumidity = document.querySelector('.weather__humidity');
const weatherFeelsLike = document.querySelector('.weather__feels-like');
const searchBar = document.querySelector('.search__bar');
const searchBtn = document.querySelector('.search__btn');
const errorDiv = document.querySelector('.error');
const weatherLocation = document.querySelector('.weather__location');


function formatWeatherData(data, city) {
  return {
    temperature: data.main.temp,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    feelsLike: data.main['feels_like'],
    city: city,
  }
}


function displayErrorInDOM(err) {
  errorDiv.textContent = err;
}

function renderWeatherData(data) {
  weatherTemperature.textContent = `${data.temperature.toFixed(1)}°C`;
  weatherDescription.textContent = data.description;
  weatherHumidity.textContent = `${data.humidity}% humidity`;
  weatherFeelsLike.textContent = `Feels like ${data.feelsLike.toFixed(1)}°C`;
  weatherLocation.textContent = data.city;
}

function removeRenderedWeatherData() {
  const allWeatherDivs = document.querySelectorAll('.weather > div');
  allWeatherDivs.forEach((div) => {
    div.textContent = "";
  });
}

searchBtn.addEventListener('click', () => {
  const searchQuery = searchBar.value;
  if (searchQuery === "") {
    const err = new Error("City name must be entered");
    displayErrorInDOM(err);
    throw err;
    
  } else {
    promiseFetch(searchQuery);

  }
});





// ### PROMISE VERSION ###

function promiseFetch(cityName) {

  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&id=524901&appid=80c5a14cc53f0fe21d2bb89222f9a766`, { mode: 'cors' })
  .then((response) => {
    if (!response.ok) {
      throw new Error('City not found. Please enter a valid city name.');
    } 
    return response.json();
  })
  .then((response) => {
    searchBar.value = "";
    const weatherData = formatWeatherData(response, cityName);
    renderWeatherData(weatherData);
    errorDiv.textContent = "";
  })
  .catch((error) => {
    // Update div with error
    // Check for fetch fail (as opposed to status fail thrown above)
    if (error.message === 'Failed to fetch') {
      displayErrorInDOM('Unable to reach server, please check your connection');
    } else {
      displayErrorInDOM(error);
    }
  });
}

// promiseFetch();



// ### ASYNC/AWAIT VERSION

async function asyncFetch(cityName) {

  try {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&id=524901&appid=80c5a14cc53f0fe21d2bb89222f9a766`, { mode: 'cors' });

    if (!response.ok) {
      console.log(`Error: ${cityName} not found`);
      throw new Error(response.status);
    }

    const APIData = await response.json();
    const weatherData = formatWeatherData(APIData, cityName);

    renderWeatherData(weatherData);
    errorDiv.textContent = "";
    searchBar.value = "";

  } catch (error) {
    // Update div with error
    removeRenderedWeatherData();
    if (error.message === 'Failed to fetch') {
      displayErrorInDOM('Unable to reach server, please check your connection');
    } else {
      displayErrorInDOM(error);
    }
  }

  
}

// asyncFetch();