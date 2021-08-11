const weatherTemperature = document.querySelector('.weather__temperature');
const weatherDescription = document.querySelector('.weather__description');
const weatherHumidity = document.querySelector('.weather__humidity');
const weatherFeelsLike = document.querySelector('.weather__feels-like');
const searchBar = document.querySelector('.search__bar');
const searchBtn = document.querySelector('.search__btn');
const errorDiv = document.querySelector('.error');
const weatherLocation = document.querySelector('.weather__location');

function formatWeatherData(data) {
  return {
    temperature: data.main.temp,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    feelsLike: data.main['feels_like'],
  }
}


function displayErrorInDOM(err) {
  weatherError.textContent = err;
}

searchBtn.addEventListener('click', () => {
  const searchQuery = searchBar.value;
  if (searchQuery === "") {
    const err = new Error("City name must be entered");
    displayErrorInDOM(err);
    throw err;
    
  } else {
    promiseFetch(searchQuery);
    searchBar.value = "";
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
    const weatherData = formatWeatherData(response);
    weatherTemperature.textContent = `${weatherData.temperature.toFixed(1)}°C`;
    weatherDescription.textContent = weatherData.description;
    weatherHumidity.textContent = `${weatherData.humidity}% humidity`;
    weatherFeelsLike.textContent = `Feels like ${weatherData.feelsLike.toFixed(1)}°C`;
    weatherLocation.textContent = cityName;
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
    const weatherData = formatWeatherData(APIData);

    weatherTemperature.textContent = `${weatherData.temperature.toFixed(1)}°C`;
    weatherDescription.textContent = weatherData.description;
    weatherHumidity.textContent = `${weatherData.humidity}% humidity`;
    weatherFeelsLike.textContent = `Feels like ${weatherData.feelsLike.toFixed(1)}°C`;

  } catch (error) {
    // Update div with error
    if (error.message === 'Failed to fetch') {
      displayErrorInDOM('Unable to reach server, please check your connection');
    } else {
      displayErrorInDOM(error);
    }
  }

  
}

// asyncFetch();