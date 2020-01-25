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
    let firstDate = sortEvents[0].dateFrom;
    let lastDate = sortEvents[sortEvents.length - 1].dateTo;

    let firstDay = new Date(firstDate).toString().split(` `);
    days.push([firstDay[1], firstDay[2]].join(` `));

    let lastDay = new Date(lastDate).toString().split(` `);
    days.push([lastDay[1], lastDay[2]].join(` `));

    let stringList = this._formatInfo(days);
    return stringList;
  }

  // Метод форматирования информации
  _formatInfo(arr) {
    return arr.length > 2 ? `${arr[0]} — ... — ${arr[arr.length - 1]}` : arr.join(` — `);
  }

  // Метод получения списка городов
  _getTripCities(arr) {
    let cities = [];

    for (let el of arr) {
      let city = el.destination.name;
      cities.push(city);
    }

    let stringList = this._formatInfo(cities);

    return stringList;
  }
}
