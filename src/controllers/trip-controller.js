import Sort from '../components/sort';
import TripDays from '../components/trip-days';
import Day from '../components/day';
import {render, Position, Mode, sortByPrice, sortByTime} from '../utils';
import EventsList from '../components/events-list';
import Statistic from '../components/statistic';
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
    this._sortType = `default`;

    this._header = new HeaderController(events);
    this._creatingEvent = null;

    this._subscriptions = [];

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  // Метод инициализации
  init() {
    render(this._container, this._sort.getElement(), Position.AFTERBEGIN);
    render(this._container, this._tripDays.getElement(), Position.BEFOREEND);

    if (!this._events.length) {
      this._renderEventMessage();
    } else {
      this._renderEventsInDays();
      document.querySelectorAll(`.trip-filters__filter-label`).forEach((filter) => filter.addEventListener(`click`, (evt) => this._onFilterClick(evt)));
      document.querySelectorAll(`.trip-sort__btn`).forEach((item) => item.addEventListener(`click`, (evt) => this._onSortLabelClick(evt)));
    }

    this._initStatistic();
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

  // Метод отрисовки статистики
  _initStatistic() {
    const container = document.querySelector(`.statistics`);
    const statisctics = new Statistic(this._events);

    container.innerHTML = ``;
    render(container, statisctics.getElement(), Position.BEFOREEND);

    statisctics.init();
  }

  // Метод рендеринга событий в соответвующий день
  _renderEventsInDays() {
    const dates = new Set(this._events.sort((a, b) => a.dateFrom - b.dateFrom).map((item) => moment(item.dateFrom).format(`YYYY MM DD`)));
    const formatDates = [...dates];

    formatDates.forEach((date, index) => {
      this._checkEventsForDate(date, index);
    });
  }

  // Метод рендеринга дней
  _renderDays(day, container, position) {
    render(this._tripDays.getElement(), day.getElement(), position === `afterBegin` ? Position.AFTERBEGIN : Position.BEFOREEND);
    render(day.getElement(), container.getElement(), Position.BEFOREEND);
  }

  // Общий метод рендеринга событий
  _renderEvents(events) {
    this._tripDays.getElement().innerHTML = ``;
    const container = new EventsList();
    this._renderDays(new Day(), container);

    if (this._sortType === `default`) {
      this._renderEventsInDays();
    } else if (this._sortType === `time`) {
      const sortedByTime = sortByTime(events);
      sortedByTime.forEach((pointData) => this._renderEvent(pointData, container));
    } else {
      const sortedByPrice = sortByPrice(events);
      sortedByPrice.forEach((pointData) => this._renderEvent(pointData, container));
    }

    if (!events.length) {
      this._renderEventMessage();
    }

    this._initStatistic();

    this._header = new HeaderController(events);
    this._header.init();
  }

  // Метод для обработки изменения данных в форме
  _onDataChange(newData, oldData, pointController) {
    const index = this._events.findIndex((point) => point === oldData);

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
          .then((point) => {
            this._creatingEvent = null;
            this._events = [point, ...this._events];
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
    this._subscriptions.forEach((item) => item());
  }

  // Метод отрисовки сообщения при отсутствии событий
  _renderEventMessage() {
    const message = new EventMessage();
    render(this._container, message.getElement(), Position.BEFOREEND);
  }

  // Метод рендеринга одного события
  _renderEvent(eventData, container) {
    const pointController = new PointController(container, eventData, this._store, PointControllerMode.DEFAULT, this._onDataChange, this._onChangeView);

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
        this._sortType = `time`;
        sortedByTime.forEach((point) => this._renderEvent(point, container));
        break;

      case `price`:
        const sortedByPrice = sortByPrice(this._events);
        this._sortType = `price`;
        sortedByPrice.forEach((point) => this._renderEvent(point, container));
        break;

      case `event`:
        this._sortType = `default`;
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
        const filteredByFuture = this._events.slice().filter((item) => item.dateFrom > now);
        filteredByFuture.forEach((point) => this._renderEvent(point, container));
        break;

      case `Past`:
        const filteredByPast = this._events.slice().filter((item) => now > item.dateFrom);
        filteredByPast.forEach((point) => this._renderEvent(point, container));
        break;
    }
  }
}
