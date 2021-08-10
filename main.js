const weatherTemperature = document.querySelector('.weather__temperature');
const weatherDescription = document.querySelector('.weather__description');
const weatherHumidity = document.querySelector('.weather__humidity');
const weatherFeelsLike = document.querySelector('.weather__feels-like');
const searchBar = document.querySelector('.search__bar');
const searchBtn = document.querySelector('.search__btn');

function formatWeatherData(data) {
  return {
    temperature: data.main.temp,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    feelsLike: data.main['feels_like'],
  }
}

searchBtn.addEventListener('click', () => {
  const searchQuery = searchBar.value;
  if (searchQuery === "") {
    throw new Error("City name must be entered")
  } else {
    asyncFetch(searchQuery);
  }
   
})


// ### PROMISE VERSION ###

function promiseFetch(cityName) {

  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&id=524901&appid=80c5a14cc53f0fe21d2bb89222f9a766`, { mode: 'cors' })
  .then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } 
    return response.json();
  })
  .then((response) => {
    const weatherData = formatWeatherData(response);
    weatherTemperature.textContent = `${weatherData.temperature.toFixed(1)}°C`;
    weatherDescription.textContent = weatherData.description;
    weatherHumidity.textContent = `${weatherData.humidity}% humidity`;
    weatherFeelsLike.textContent = `Feels like ${weatherData.feelsLike.toFixed(1)}°C`;
  })
  .catch((error) => {
    console.log(error);
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
    console.log(error);
  }

  
}

// asyncFetch();