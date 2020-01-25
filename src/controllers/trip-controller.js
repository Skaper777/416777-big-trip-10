import Sort from '../components/sort';
import TripDays from '../components/trip-days';
import Day from '../components/day';
import {render, position, Mode, sortByPrice, sortByTime} from '../utils';
import EventsList from '../components/events-list';
import PointController from './point-controller';
import EventMessage from '../components/event-message';
import HeaderController from './header-controller';
import moment from 'moment';
/**
 * Класс контроллера путешествия
 */
const PointControllerMode = Mode;

export default class TripController {
  constructor(container, events, store, api) {
    this._container = container;
    this._events = events;
    this._sort = new Sort();
    this._tripDays = new TripDays();

    this._store = store;
    this._api = api;

    this._header = new HeaderController(events);
    this._creatingEvent = null;

    this._subscriptions = [];

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  // Метод инициализации
  init() {
    render(this._container, this._sort.getElement(), position.AFTERBEGIN);
    render(this._container, this._tripDays.getElement(), position.BEFOREEND);

    if (!this._events.length) {
      this._renderEventMessage();
    } else {
      this._renderEventsInDays();
      document.querySelectorAll(`.trip-filters__filter-label`).forEach((filter) => filter.addEventListener(`click`, (evt) => this._onFilterClick(evt)));
      document.querySelectorAll(`.trip-sort__btn`).forEach((item) => item.addEventListener(`click`, (evt) => this._onSortLabelClick(evt)));
    }

    this._header.init();
  }

  // Метод для скрывания списка событий
  hide() {
    this._container.classList.add(`trip-events--hidden`);
  }

  // Метод для возвращения списка событий
  show() {
    this._container.classList.remove(`trip-events--hidden`);
  }

  // Метод создания события
  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    this._onChangeView();

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

    this._renderDays(new Day(null, 0), container, `afterBegin`);
    this._creatingEvent = new PointController(container, defaultEvent, this._store, PointControllerMode.ADDING, this._onDataChange, this._onChangeView);

    this._subscriptions.push(this._creatingEvent.setDefaultView.bind(this._creatingEvent));
  }

  // Метод проверки соответсвия событий и дат
  _checkEventsForDate(date, index) {
    const day = new Day(date, index + 1);
    const eventsList = new EventsList();

    this._renderDays(day, eventsList);

    this._events.filter((event) => {
      return moment(event.dateFrom).format(`YYYY MM DD`) === date;
    })
    .forEach((event) => {
      this._renderEvent(event, eventsList);
    });
  }

  // Метод рендеринга событий в соответвующий день
  _renderEventsInDays() {
    let dates = new Set(this._events.map((item) => moment(item.dateFrom).format(`YYYY MM DD`)));
    let formatDates = [...dates];

    formatDates.forEach((date, index) => {
      this._checkEventsForDate(date, index);
    });
  }

  // Метод рендеринга дней
  _renderDays(day, container, pos) {
    render(this._tripDays.getElement(), day.getElement(), pos === `afterBegin` ? position.AFTERBEGIN : position.BEFOREEND);
    render(day.getElement(), container.getElement(), position.BEFOREEND);
  }

  // Общий метод рендеринга событий
  _renderEvents(events) {
    this._tripDays.getElement().innerHTML = ``;

    this._renderEventsInDays();

    if (!events.length) {
      this._renderEventMessage();
    }

    this._header = new HeaderController(events);
    this._header.init();
  }

  // Метод для обработки изменения данных в форме
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
            pointController.errorFormHandler();
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
            pointController.errorFormHandler();
          });

      } else { // редактирование старого ивента
        this._api.updatePoint(oldData.id, newData)
          .then((point) => {
            this._events[index] = point;
            this._renderEvents(this._events);
          })
          .catch(() => {
            pointController.errorFormHandler();
          });
      }
    }
  }

  // Метод обработки изменений вида события
  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  // Метод отрисовки сообщения при отсутствии событий
  _renderEventMessage() {
    const message = new EventMessage();
    render(this._container, message.getElement(), position.BEFOREEND);
  }

  // Метод рендеринга одного события
  _renderEvent(data, container) {
    const pointController = new PointController(container, data, this._store, PointControllerMode.DEFAULT, this._onDataChange, this._onChangeView);

    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  // Метод обработки клика на кнопки сортировки
  _onSortLabelClick(evt) {
    this._tripDays.getElement().innerHTML = ``;

    const container = new EventsList();

    this._renderDays(new Day(), container);

    switch (evt.target.dataset.sortType) {
      case `time`:
        const sortedByTime = sortByTime(this._events);
        sortedByTime.forEach((data) => this._renderEvent(data, container));
        break;

      case `price`:
        const sortedByPrice = sortByPrice(this._events);
        sortedByPrice.forEach((data) => this._renderEvent(data, container));
        break;

      case `event`:
        this._renderEvents(this._events);
        break;
    }
  }

  // Метод обработки клика на кнопки фильтрации
  _onFilterClick(evt) {
    this._tripDays.getElement().innerHTML = ``;

    const now = Date.now();
    const container = new EventsList();

    this._renderDays(new Day(), container);

    switch (evt.target.textContent) {
      case `Everything`:
        this._renderEvents(this._events);
        break;

      case `Future`:
        const filteredByFuture = this._events.slice().filter((item) => moment(item.dateFrom).format(`x`) > now);
        filteredByFuture.forEach((data) => this._renderEvent(data, container));
        break;

      case `Past`:
        const filteredByPast = this._events.slice().filter((item) => now > moment(item.dateFrom).format(`x`));
        filteredByPast.forEach((data) => this._renderEvent(data, container));
        break;
    }
  }
}
