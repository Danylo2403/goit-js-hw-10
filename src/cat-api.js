
import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_e39CRNOEXbQHpy5rwCCTtYBJulj23EIrwSMc1UFqHmws487B3M3wjYloX5TunLbt';

// Функція для отримання списку порід котів
export const fetchBreeds = function fetchBreeds() {
  // Виконуємо GET-запит до API для отримання списку порід котів
  return axios.get('https://api.thecatapi.com/v1/breeds').then(response => {
      if (response.status < 200 || response.status > 299) {
        
    }
    // Повертаємо дані, які отримали від API (список порід котів)
    return response.data;
  });
};

// Функція для отримання інформації про кота за ID породи
export const fetchCatByBreed = function fetchCatByBreed(breedId) {
  // Виконуємо GET-запит до API, вказуючи ID породи
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      console.log(response); // Виводимо відповідь в консоль для налагодження і відладки

      if (response.status < 200 || response.status > 299) {
        
        throw new Error(response.statusCode);
      }
      // Повертаємо дані, які отримали від API (інформацію про кота за вказаним ID породи)
      return response.data;
    });
};
