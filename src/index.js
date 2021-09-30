import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const qs = selector => document.querySelector(selector);
const qsa = selector => document.querySelectorAll(selector);
const countrySearchBox = qs('input#search-box');
const countryList = qs('.country-list');
const countryInfo = qs('.country-info');

const countryListClear = () => {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
};

const searchCountry = () => {
  let name = countrySearchBox.value.trim();
  console.log(fetchCountries(name));
  if (name.length === 0) {
    countryListClear();
  } else {
    fetchCountries(name)
      .then(name => {
        if (name.length > 10) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (name.length >= 2 && name.length <= 10) {
          renderCountriesNameList(name);
          countryList.style.display = 'block';
        } else if (name.length === 1) {
          renderCountriesInfo(name);
          countryList.style.display = 'none';
        } else {
          Notiflix.Notify.failure('Oops, there is no country with that name');
          countryListClear();
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        countryListClear();
      });
  }
};
countrySearchBox.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

const renderCountriesNameList = name => {
  const markup = name
    .map(country => {
      return `<li class="country-list">
        <img class="country-flag" src = "${country.flags.svg}" alt = "Flag of ${country.name}" width = "50" height = "40"><span class="country-name">${country.name}</span></img></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
};

const renderCountriesInfo = name => {
  const markup = name
    .map(country => {
      return `<li class="country-info">
        <img class="country-flag" src = "${country.flags.svg}" alt = "Flag of ${
        country.name
      }" width = "50" height = "40"><span class="country-name">${country.name}</span></img>
          <p class="country-info__item"><b>Capital</b>: ${country.capital}</p>
          <p class="country-info__item"><b>Population</b>: ${country.population}</p>
          <p class="country-info__item"><b>Languages</b>: ${country.languages.map(
            language => ' ' + language.name,
          )}</p> </li>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
};

//STYLE

countryList.style.listStyle = 'none';
countryList.style.fontSize = '20px';
countryList.style.marginBottom = '10px';
countryList.style.marginLeft = '5px';
countryList.style.padding = '0';

countryInfo.style.listStyle = 'none';
countryInfo.style.marginLeft = '15px';
countryInfo.style.marginTop = '20px';
