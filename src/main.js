const form = document.querySelector('form');

const geocodingBaseAPI =
  'http://www.mapquestapi.com/geocoding/v1/address?key=er3hjA7tECfpUhqpuk6aCeNPk4vGxdHq&location=';

const weatherBaseAPI = 'https://www.7timer.info/bin/civil.php?unit=metric&output=json';

const getCoordinates = async (input) => {
  const response = await fetch(`${geocodingBaseAPI}${input}`);
  const data = await response.json();
  return data.results[0].locations[0].latLng;
};

const getWeather = async (lat, lng) => {
  const response = await fetch(`${weatherBaseAPI}&lat=${lat}&lon=${lng}`);
  const data = await response.json();
  return data;
};

const mapCloudIndexToText = {
  1: 'Clear',
  2: 'Clear',
  3: 'Partly cloudy',
  4: 'Partly cloudy',
  5: 'Partly cloudy',
  6: 'Cloudy',
  7: 'Cloudy',
  8: 'Very cloudy',
  9: 'Very cloudy',
};

const renderResultsDOM = (temp, wind, cloudIndex, city) => {
  const main = document.querySelector('main');
  const weatherNode = document.createElement('section');
  const generateParagraph = (element) => document.createElement(element);

  const tempNode = document.createTextNode(`Temperature: ${temp} C`);
  const cloudNode = document.createTextNode(`${mapCloudIndexToText[cloudIndex]}`);
  const windNode = document.createTextNode(`Wind speed: ${wind.speed} m/s, direction: ${wind.direction}`);
  const h2Node = document.createTextNode(`${city.toUpperCase()} weather info:`);

  weatherNode.appendChild(generateParagraph('h2')).appendChild(h2Node);
  weatherNode.appendChild(generateParagraph('p')).appendChild(cloudNode);
  weatherNode.appendChild(generateParagraph('p')).appendChild(tempNode);
  weatherNode.appendChild(generateParagraph('p')).appendChild(windNode);

  main.appendChild(weatherNode);
};

const handleSubmit = async (e) => {
  const inputField = document.querySelector('input');
  e.preventDefault();
  const { lat, lng } = await getCoordinates(inputField.value);
  const weatherData = await getWeather(lat, lng);
  const { temp2m, cloudcover, wind10m } = weatherData.dataseries[0];
  renderResultsDOM(temp2m, wind10m, cloudcover, inputField.value);
  inputField.value = '';
  inputField.focus();
};

form.addEventListener('submit', handleSubmit);
