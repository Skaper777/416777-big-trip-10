import {AbstractComponent} from './abstract';

export class TripInfo extends AbstractComponent {
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

  _getTripDate() {
    let days = [];
    let date = this._events[0].dateFrom;
    let day = new Date(date).toString().split(` `);
    let newDay = [day[1], day[2]].join(` `);
    days.push(newDay);
    let stringList = this._formatInfo(days);
    return stringList;
  }

  _formatInfo(arr) {
    return arr.length > 2 ? `${arr[0]} — ... — ${arr[arr.length - 1]}` : arr.join(` — `);
  }

  _getTripCities(arr) {
    let cities = [];

    for (let el of arr) {
      let city = el.destination;
      cities.push(city);
    }

    let stringList = this._formatInfo(cities);

    return stringList;
  }
}
