const form = document.querySelector('form');
const main = document.querySelector('main');
const loadingSpinner = document.querySelector('.loading_popup');

const toggleLoadingSpinner = () => loadingSpinner.classList.toggle('loading');

const geocodingBaseAPI =
  'http://www.mapquestapi.com/geocoding/v1/address?key=er3hjA7tECfpUhqpuk6aCeNPk4vGxdHq&location=';

const weatherBaseAPI = 'https://www.7timer.info/bin/civil.php?unit=metric&output=json';

const getCoordinates = async (input) => {
  const response = await fetch(`${geocodingBaseAPI}${input}`);
  const data = await response.json();
  return data.results[0].locations[0].latLng;
};

const getCoordinatesPromise = (input) => {
  return fetch(`${geocodingBaseAPI}${input}`)
    .then((resp) => resp.json())
    .then((data) => data.results[0].locations[0].latLng);
};

const getWeather = async (lat, lng) => {
  const response = await fetch(`${weatherBaseAPI}&lat=${lat}&lon=${lng}`);
  const data = await response.json();
  return data;
};

const getWeatherPromise = (lat, lng) => {
  return fetch(`${weatherBaseAPI}&lat=${lat}&lon=${lng}`)
    .then((resp) => resp.json())
    .then((data) => data);
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

const createElement = (element) => document.createElement(element);

const renderResultsDOM = (temp, wind, cloudIndex, city) => {
  const weatherNode = createElement('section');

  const header2Node = document.createTextNode(`${city.toUpperCase()} current weather:`);
  const tempNode = document.createTextNode(`Temperature: ${temp} C`);
  const cloudNode = document.createTextNode(`${mapCloudIndexToText[cloudIndex]}`);
  const windNode = document.createTextNode(`Wind speed: ${wind.speed} m/s, direction: ${wind.direction}`);

  weatherNode.appendChild(createElement('h2')).appendChild(header2Node);
  weatherNode.appendChild(createElement('p')).appendChild(cloudNode);
  weatherNode.appendChild(createElement('p')).appendChild(tempNode);
  weatherNode.appendChild(createElement('p')).appendChild(windNode);

  main.appendChild(weatherNode);
};

const renderErrorDOM = (error) => {
  const errorNode = createElement('div');
  const errMsgNode = createElement('b');
  const errMsgTextNode = document.createTextNode(`Something went wrong: ${error}`);

  errMsgNode.appendChild(errMsgTextNode);
  errorNode.appendChild(errMsgNode);
  main.appendChild(errorNode);
};

const handleSubmit = async (e) => {
  try {
    e.preventDefault();
    toggleLoadingSpinner();
    const inputField = document.querySelector('input');
    const { lat, lng } = await getCoordinates(inputField.value);
    const weatherData = await getWeather(lat, lng);
    const { temp2m, cloudcover, wind10m } = weatherData.dataseries[0];
    renderResultsDOM(temp2m, wind10m, cloudcover, inputField.value);
    toggleLoadingSpinner();
    inputField.focus();
  } catch (error) {
    renderErrorDOM(error);
    toggleLoadingSpinner();
  }
};

const handleSubmitWithPromises = (e) => {
  e.preventDefault();
  toggleLoadingSpinner();
  const inputField = document.querySelector('input');
  getCoordinatesPromise(inputField.value)
    .then((coord) => getWeatherPromise(coord.lat, coord.lng))
    .then((weatherData) => {
      const { temp2m, cloudcover, wind10m } = weatherData.dataseries[0];
      const city = inputField.value;
      renderResultsDOM(temp2m, wind10m, cloudcover, city);
      toggleLoadingSpinner();
      inputField.focus();
    })
    .catch((err) => {
      renderErrorDOM(err);
      toggleLoadingSpinner();
    });
};

const combinedHandler = (e) => {
  handleSubmit(e);
  handleSubmitWithPromises(e);
};

form.addEventListener('submit', combinedHandler);
