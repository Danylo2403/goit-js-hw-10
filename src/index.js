// Імпортую бібліотеку SlimSelect для створення стильного селекту
import SlimSelect from 'slim-select';
// Імпортую стилі SlimSelect
import 'slim-select/dist/slimselect.css';
// Імпортую бібліотеку Notiflix для відображення сповіщень
import Notiflix from 'notiflix';
// Імпортую стилі Notiflix
import 'notiflix/dist/notiflix-3.2.6.min.css';

// Імпортую функції для взаємодії з API котів
import { fetchBreeds } from './cat-api';
import { fetchCatByBreed } from './cat-api';

// Отримуємо посилання на HTML-елементи сторінки
const select = document.querySelector('.breed-select'); // Селект для вибору породи кота
const catInfo = document.querySelector('.cat-info'); // Контейнер для відображення інформації про кота
const loader = document.querySelector('.loader'); // Елемент-індикатор завантаження

// Ініціалізую SlimSelect для створення стильного селекту
const catsSelect = new SlimSelect({
  select: select, // Вказую селект, до якого буде застосований SlimSelect
  settings: {
    showSearch: false, // Вимикаю можливість пошуку в селекті
    placeholderText: 'Please, choose a cat!', // Текст-заглушка
  },
});

// Додаю слухача подій для зміни вибору в селекті
select.addEventListener('change', selectChangeHandler);

// Завантажую список порід котів при завантаженні сторінки
fetchBreeds()
  .then(breeds => renderCatSelectOptions(breeds))
  .catch(err => showError());

// Функція, яка виконується при зміні вибору в селекті
function selectChangeHandler() {
  catInfo.innerHTML = ''; // Очищаю контейнер для інформації про кота
  loader.classList.remove('visually-hidden'); // індикатор завантаження
  fetchCatByBreed(this.value) // Завантажую інформацію про кота відповідно до вибраної породи
    .then(info => {
      if (info.length == 0) {
        showNotificateEmpty(); // Якщо немає інформації про кота, виводимо відповідне сповіщення
        return;
      }
      renderCatCard(info); // Відображаємо інформацію про кота на сторінці
    })
    .catch(err => showError());
}

// Функція для відображення варіантів вибору порід котів в селекті
function renderCatSelectOptions(breeds) {
  const breedProperties = breeds.map(({ id, name }) => {
    return {
      text: name,
      value: id,
    };
  });
  breedProperties.unshift({ text: '', placeholder: true }); // Додаємо пустий варіант в селект як placeholder
  catsSelect.setData(breedProperties); // Встановлюємо дані для SlimSelect
  loader.classList.add('visually-hidden'); // Ховаємо індикатор завантаження
  select.classList.remove('visually-hidden'); // Показуємо селект для вибору породи
}

// Функція для відображення інформації про кота
function renderCatCard(info) {
  const markup = info
    .map(({ url, breeds }) => {
      return breeds
        .map(({ name, description, temperament }) => {
          return `<img class="cat-info__img" src="${url}" alt="${name}" />
          <h1 class="cat-info__name">${name}</h1>
          <p class="cat-info__descr">${description}</p>
          <p class="cat-info__text">This cat is: ${temperament}</p>`;
        })
        .join('');
    })
    .join('');
  catInfo.innerHTML = markup;
  catInfo.classList.remove('visually-hidden'); // Показуємо контейнер з інформацією про кота
  loader.classList.add('visually-hidden'); // Ховаємо індикатор завантаження
}

// Функція для відображення сповіщення про помилку
function showError() {
  loader.classList.add('visually-hidden'); // Ховаємо індикатор завантаження
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page!'
  );
}

// Функція для відображення сповіщення, якщо інформація про кота відсутня
function showNotificateEmpty() {
  loader.classList.add('visually-hidden'); // Ховаємо індикатор завантаження
  Notiflix.Notify.warning('There is no cat :(');
}
