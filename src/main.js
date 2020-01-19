import {Menu} from './components/menu';
import {Filters} from './components/filters';
import {getMenu} from './data';
import {render, position} from './utils';

import {TripController} from './controllers/trip-controller';
import {Stats} from './components/stats';
import {API} from './api.js';
import {Store} from './data';

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

const store = new Store();
const api = new API(END_POINT, AUTHORIZATION);

const menuContainer = document.querySelector(`.trip-main__trip-controls`);
const tripContainer = document.querySelector(`.trip-events`);
const mainContainer = document.querySelectorAll(`.page-body__container`)[1];

const stats = new Stats();

const renderStats = () => {
  render(mainContainer, stats.getElement(), position.BEFOREEND);
};

renderStats();

const renderMenu = (mock) => {
  const menu = new Menu(mock);

  render(menuContainer, menu.getElement(), position.AFTERBEGIN);

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

const addBtn = document.querySelector(`.trip-main__event-add-btn`);

const addEvent = () => {
  tripController.createEvent();
};

addBtn.addEventListener(`click`, addEvent);

const renderFilters = () => {
  const filters = new Filters();

  render(menuContainer, filters.getElement(), position.BEFOREEND);
};

let tripController;

const offs = api.getOffers();
const pnts = api.getPoints();
const dstns = api.getDestinations();

Promise.all([offs, pnts, dstns]).then((res) => {
  const [offers, points, destinations] = res;

  store.setDestinations(destinations);
  store.setOffers(offers);

  points.sort((a, b) => a.dateFrom - b.dateFrom);
  tripController = new TripController(tripContainer, points, store, api);
  tripController.init();

  const statsGraph = new Stats(points);
  statsGraph.init();

  tripController.filterEvents();
});

renderMenu(getMenu());
renderFilters();
