import {Sort} from '../components/sort';
import {TripDays} from '../components/trip-days';
import {Day} from '../components/day';
import {render, position, Mode, sortByDate, sortByPrice, sortByTime} from '../utils';
import {EventsList} from '../components/events-list';
import {PointController} from './point-controller';
import {EventMessage} from '../components/event-message';
import {HeaderController} from './header-controller';
import moment from 'moment';

const PointControllerMode = Mode;

export class TripController {
  constructor(container, events, store, api) {
    this._container = container;
    this._events = events;
    this._sort = new Sort();
    this._tripDays = new TripDays();
    this._dates = new Set(this._events.map((item) => moment(item.dateFrom).format(`DD`)));

    this._store = store;
    this._api = api;

    this._header = new HeaderController(events);
    this._creatingEvent = null;

    this._subscriptions = [];

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    render(this._container, this._sort.getElement(), position.AFTERBEGIN);
    render(this._container, this._tripDays.getElement(), position.BEFOREEND);

    this._dates.forEach((date, index) => {
      const day = new Day(date, index);
      const eventsList = new EventsList();

      this._renderDays(day, eventsList);

      this._events.filter((event) => {
        return moment(event.dateFrom).format(`DD`) === date;
      })
      .forEach((event) => {
        this._renderEvent(event, eventsList);
      });
    });

    const sortBtns = document.querySelectorAll(`.trip-sort__btn`);

    for (let i = 0; i < sortBtns.length; i++) {
      sortBtns[i].addEventListener(`click`, (evt) => this._onSortLabelClick(evt));
    }

    this._header.init();
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

    const container = new EventsList();
    const day = new Day(66666, 16);

    this._renderDays(day, container, `afterBegin`);

    this._creatingEvent = new PointController(container, defaultEvent, this._store, PointControllerMode.ADDING, this._onDataChange, this._onChangeView);
  }

  _renderDays(day, container, pos) {
    render(this._tripDays.getElement(), day.getElement(), pos === `afterBegin` ? position.AFTERBEGIN : position.BEFOREEND);
    render(day.getElement(), container.getElement(), position.BEFOREEND);
  }

  _renderEvents(events) {
    this._tripDays.getElement().innerHTML = ``;

    this._dates.forEach((date, index) => {
      const day = new Day(date, index);
      const eventsList = new EventsList();

      this._renderDays(day, eventsList);

      events.filter((event) => {
        return moment(event.dateFrom).format(`DD`) === date;
      })
      .forEach((event) => {
        this._renderEvent(event, eventsList);
      });
    });

    //const sortedEvents = sortByDate(events);
    //sortedEvents.forEach((mock) => this._renderEvent(mock));

    this._header = new HeaderController(events);
    this._header.init();
  }

  _onDataChange(newData, oldData, pointController) {
    const index = this._events.findIndex((mock) => mock === oldData);

    if (newData === null) {
      if (oldData === null) { // если открыт новый ивент
        this._creatingEvent = null; // удаляется пустая форма
        this._renderEvents(this._events);
      } else {
        this._api.deletePoint(oldData.id)
          .then(() => {
            this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)]; // удаление старого ивента
            this._renderEvents(this._events);
          })
          .catch(() => {
            pointController.errorOnForm();
          });
      }
    } else {
      if (oldData === null) { // создание нового ивента
        this._api.createPoint(newData)
          .then((data) => {
            this._creatingEvent = null;
            this._events = [data, ...this._events];
            this._renderEvents(this._events);
          })
          .catch(() => {
            pointController.errorOnForm();
          });

      } else { // редактирование старого ивента
        this._api.updatePoint(oldData.id, newData)
          .then((point) => {
            this._events[index] = point;
            this._renderEvents(this._events);
          })
          .catch(() => {
            pointController.errorOnForm();
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

  _renderEvent(eventMock, container) {
    const pointController = new PointController(container, eventMock, this._store, PointControllerMode.DEFAULT, this._onDataChange, this._onChangeView);

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
