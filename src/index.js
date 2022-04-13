import './css/styles.css';

import { fetchCountries } from './js/service/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearchBoxInput, DEBOUNCE_DELAY));

function onSearchBoxInput(event) {
  event.preventDefault();

  const enteredText = searchBox.value.trim();
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  if (enteredText) {
    fetchCountries(enteredText)
      .then(checkQuantity)
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }

  function checkQuantity(data) {
    if (data.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');

      return;
    }

    createMarkup(data);
  }
  function createMarkup(data) {
    const markupData = data
      .map(({ flags: { svg }, name: { official } }) => {
        return `<div class="card" style="width: 18rem;">
    <img class="card-img-top" src="${svg}" alt="${official}">
    <div class="card-body">
      <h5 class="card-title">${official}</h5>
    </div>
  </div>`;
      })
      .join('');

    if (data.length === 1) {
      const languages = Object.values(data[0].languages).join(', ');

      const markupInfo = `<div class="card card-margin-reset" style="width: 18rem;"><ul class="list-group list-group-flush">
      <li class="list-group-item">Capital: ${data[0].capital}</li>
      <li class="list-group-item">Population: ${data[0].population}</li>
      <li class="list-group-item">Languages: ${languages}</li>
    </ul> </div>`;

      countryInfo.insertAdjacentHTML('beforeend', markupInfo);
    }
    return countryList.insertAdjacentHTML('afterbegin', markupData);
  }
}
