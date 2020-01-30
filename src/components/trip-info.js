import AbstractComponent from './abstract';
import {sortByDate} from '../utils';
/**
 * Класс шаблона информации о путешествии
 */
export default class TripInfo extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return `<div class="trip-info__main">
      <h1 class="trip-info__title">${this._getTripCities(this._events)}</h1>

      <p class="trip-info__dates">${this._getTripDate()}</p>
    </div>
    `;
  }

  // Метод получения дат поездки
  _getTripDate() {
    let days = [];
    const sortEvents = sortByDate(this._events);
    const firstDate = sortEvents[0].dateFrom;
    const lastDate = sortEvents[sortEvents.length - 1].dateTo;

    const firstDay = new Date(firstDate).toString().split(` `);
    days.push([firstDay[1], firstDay[2]].join(` `));

    const lastDay = new Date(lastDate).toString().split(` `);
    days.push([lastDay[1], lastDay[2]].join(` `));

    const strings = this._formatInfo(days);
    return strings;
  }

  // Метод форматирования информации
  _formatInfo(info) {
    const INFO_LENGTH = 2;
    return info.length > INFO_LENGTH ? `${info[0]} — ... — ${info[info.length - 1]}` : info.join(` — `);
  }

  // Метод получения списка городов
  _getTripCities(elements) {
    let cities = [];

    for (let element of elements) {
      const city = element.destination.name;
      cities.push(city);
    }

    const stringList = this._formatInfo(cities);

    return stringList;
  }
}
