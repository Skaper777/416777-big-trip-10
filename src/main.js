import Menu from './components/menu';
import Filters from './components/filters';
import {render, Position} from './utils';
import TripController from './controllers/trip-controller';
import Stats from './components/stats';
import API from './api.js';
import Store from './store';
/**
 * Точка входа приложения
 */
const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

const menuContainer = document.querySelector(`.trip-main__trip-controls`);
const tripContainer = document.querySelector(`.trip-events`);
const mainContainer = document.querySelectorAll(`.page-body__container`)[1];
const addBtn = document.querySelector(`.trip-main__event-add-btn`);

const store = new Store();
const api = new API(END_POINT, AUTHORIZATION);
const stats = new Stats();

let tripController;

// Метод отрисовки блока статистики
const renderStats = () => {
  render(mainContainer, stats.getElement(), Position.BEFOREEND);
};

// Метод отрисовки блока меню
const renderMenu = () => {
  const menu = new Menu();

  render(menuContainer, menu.getElement(), Position.AFTERBEGIN);

  menu.getElement().addEventListener(`click`, (e) => {
    e.preventDefault();

    if (e.target.tagName !== `A`) {
      return;
    }

    switch (e.target.innerText) {
      case `Table`:
        menu.getElement().querySelector(`a:first-of-type`).classList.add(`trip-tabs__btn--active`);
        menu.getElement().querySelector(`a:last-of-type`).classList.remove(`trip-tabs__btn--active`);
        stats.getElement().classList.add(`visually-hidden`);
        tripController.show();
        break;
      case `Stats`:
        menu.getElement().querySelector(`a:first-of-type`).classList.remove(`trip-tabs__btn--active`);
        menu.getElement().querySelector(`a:last-of-type`).classList.add(`trip-tabs__btn--active`);
        stats.getElement().classList.remove(`visually-hidden`);
        tripController.hide();
        break;
    }
  });
};

// Метод создания нвого события
const addEvent = () => {
  tripController.createEvent();
};

// Метод отрисовки блока фильтров
const renderFilters = () => {
  const filters = new Filters();

  render(menuContainer, filters.getElement(), Position.BEFOREEND);
};

// Загрузка данных и создания контроллера поездки
Promise.all([api.getOffers(), api.getPoints(), api.getDestinations()]).then((result) => {
  const [offers, points, destinations] = result;

  store.setDestinations(destinations);
  store.setOffers(offers);

  points.sort((a, b) => a.dateFrom - b.dateFrom);
  tripController = new TripController(tripContainer, points, store, api);
  tripController.init();

  const statsGraph = new Stats(points);
  statsGraph.init();
});

addBtn.addEventListener(`click`, addEvent);
renderStats();
renderMenu();
renderFilters();
