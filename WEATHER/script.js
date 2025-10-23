const cityInput = document.getElementById('city');
const searchBtn = document.getElementById('search');
const wCity = document.getElementById('w-city');
const wTemp = document.getElementById('w-temp');
const wCond = document.getElementById('w-cond');

// Mock weather data
const weatherData = {
  'London': {temp: 15, cond:'Cloudy'},
  'Paris': {temp: 20, cond:'Sunny'},
  'New York': {temp: 22, cond:'Rainy'}
};

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if(weatherData[city]){
    wCity.textContent = city;
    wTemp.textContent = weatherData[city].temp;
    wCond.textContent = weatherData[city].cond;
  } else {
    alert('City not found in mock data!');
  }
});
