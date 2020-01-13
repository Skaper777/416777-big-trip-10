import {Sort} from '../components/sort';
import {TripDays} from '../components/trip-days';
import {Day} from '../components/day';
import {render, position, Mode, sortByDate, sortByPrice, sortByTime} from '../utils';
import {EventsList} from '../components/events-list';
import {PointController} from './point-controller';
import {EventMessage} from '../components/event-message';
import moment from 'moment';

const PointControllerMode = Mode;

export class TripController {
  constructor(container, events, store, api) {
    this._container = container;
    this._events = events;
    this._sort = new Sort();
    this._tripDays = new TripDays();
    this._day = new Day();
    this._eventsList = new EventsList();
    this._store = store;
    this._api = api;

    this._creatingEvent = null;

    this._subscriptions = [];

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    render(this._container, this._sort.getElement(), position.AFTERBEGIN);
    render(this._container, this._tripDays.getElement(), position.BEFOREEND);
    render(this._tripDays.getElement(), this._day.getElement(), position.AFTERBEGIN);
    render(this._day.getElement(), this._eventsList.getElement(), position.BEFOREEND);

    const sortBtns = document.querySelectorAll(`.trip-sort__btn`);

    for (let i = 0; i < sortBtns.length; i++) {
      sortBtns[i].addEventListener(`click`, (evt) => this._onSortLabelClick(evt));
    }

    this._events.forEach((mock) => this._renderEvent(mock));
  }

  hide() {
    this._container.classList.add(`trip-events--hidden`);
  }

  show() {
    this._container.classList.remove(`trip-events--hidden`);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    const defaultEvent = {
      type: `taxi`,
      destination: {
        name: ``,
        description: ``,
        pictures: [{
          src: ``,
          description: ``
        }]
      },
      dateFrom: new Date(),
      dateTo: new Date(),
      price: 0,
      offers: [],
      isFavorite: false
    };

    this._creatingEvent = new PointController(this._eventsList, defaultEvent, this._store, PointControllerMode.ADDING, this._onDataChange, this._onChangeView);
  }

  _renderEvents(events) {
    this._eventsList.removeElement();

    render(this._day.getElement(), this._eventsList.getElement(), position.BEFOREEND);

    const sortedEvents = sortByDate(events);
    sortedEvents.forEach((mock) => this._renderEvent(mock));
  }

  _onDataChange(newData, oldData) {
    const index = this._events.findIndex((mock) => mock === oldData);

    if (newData === null) {
      if (oldData === null) { // если открыт новый ивент
        this._creatingEvent = null; // удаляется пустая форма
      } else {
        this._api.deletePoint(oldData.id)
          .then(() => {
            this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)]; // удаление старого ивента
            this._renderEvents(this._events);
          });
      }
    } else {
      if (oldData === null) { // создание нового ивента
        this._api.createPoint(newData)
          .then((data) => {
            this._creatingEvent = null;
            this._events = [data, ...this._events];
            this._renderEvents(this._events);
          });

      } else { // редактирование старого ивента
        this._api.updatePoint(oldData.id, newData)
          .then((point) => {
            this._events[index] = point;
            this._renderEvents(this._events);
          });
      }
    }
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _renderEventMessage() {
    const message = new EventMessage();
    const mainContainer = document.querySelector(`.page-main`);

    render(mainContainer, message.getElement(), position.AFTERBEGIN);
  }

  _renderEvent(eventMock) {
    const pointController = new PointController(this._eventsList, eventMock, this._store, PointControllerMode.DEFAULT, this._onDataChange, this._onChangeView);

    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onSortLabelClick(evt) {
    document.querySelector(`.trip-events__list`).innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `time`:
        const sortedByTime = sortByTime(this._events);
        sortedByTime.forEach((mock) => this._renderEvent(mock));
        break;

      case `price`:
        const sortedByPrice = sortByPrice(this._events);
        sortedByPrice.forEach((mock) => this._renderEvent(mock));
        break;

      case `event`:
        this._events.forEach((mock) => this._renderEvent(mock));
        break;
    }
  }

  filterEvents() {
    const filterBtns = document.querySelectorAll(`.trip-filters__filter-label`);

    for (let i = 0; i < filterBtns.length; i++) {
      filterBtns[i].addEventListener(`click`, (evt) => this._onFilterClick(evt));
    }
  }

  _onFilterClick(evt) {
    document.querySelector(`.trip-events__list`).innerHTML = ``;
    const now = Date.now();

    switch (evt.target.textContent) {
      case `Everything`:
        this._events.forEach((mock) => this._renderEvent(mock));
        break;

      case `Future`:
        const filteredByFuture = this._events.slice().filter((item) => moment(item.dateFrom).format(`x`) > now);
        filteredByFuture.forEach((mock) => this._renderEvent(mock));
        break;

      case `Past`:
        const filteredByPast = this._events.slice().filter((item) => now > moment(item.dateFrom).format(`x`));
        filteredByPast.forEach((mock) => this._renderEvent(mock));
        break;
    }
  }
}
