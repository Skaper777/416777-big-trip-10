import {AbstractComponent} from './abstract';
import moment from 'moment';
import {getDuration} from '../utils';

export class Point extends AbstractComponent {
  constructor({type, destination, dateFrom, dateTo, price, offers}) {
    super();
    this._type = type;
    this._destination = destination;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._price = price;
    this._offers = offers;
  }

  _getTitle() {
    switch (this._type) {
      case `taxi`:
        return `Taxi to`;

      case `bus`:
        return `Bus to`;

      case `train`:
        return `Train to`;

      case `ship`:
        return `Ship to`;

      case `transport`:
        return `Transport to`;

      case `drive`:
        return `Drive to`;

      case `flight`:
        return `Flight to`;

      case `check-in`:
        return `Check-in in`;

      case `sightseeing`:
        return `Sightseeing in`;

      case `restaurant`:
        return `Restaurant in`;

      default:
        return ``;
    }
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${this._getTitle()} ${this._destination}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${moment(this._dateFrom).format(`hh:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${moment(this._dateTo).format(`hh:mm`)}</time>
        </p>
        <p class="event__duration">${getDuration(this._dateFrom, this._dateTo)}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${this._price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${
  this._offers.map((arr) =>
    `<li class="event__offer"><span class="event__offer-title">${arr.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${arr.price}</span>
      </li>`).slice(0, 3).join(``)}

      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
    `;
  }
}
