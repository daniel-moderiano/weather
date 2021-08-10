const weatherDiv = document.querySelector('.weather');

const cityName = 'Sydney';

function formatTemperatureInCelsius(temperature) {
  weatherDiv.textContent = temp + '°C';
}

const apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&id=524901&appid=80c5a14cc53f0fe21d2bb89222f9a766`;

fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&id=524901&appid=80c5a14cc53f0fe21d2bb89222f9a766`, { mode: 'cors' })
  .then((response) => response.json())

  // Do something with the JSON API data
  .then((response) => {
    const temperature = response.main.temp;
    weatherDiv.textContent = temperature.toFixed(1) + '°C';
  })

  // Do something with the error data
  .catch((error) => console.log(error));
