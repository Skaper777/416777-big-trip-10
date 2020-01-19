import {AbstractComponent} from './abstract';
import moment from 'moment';

export class Day extends AbstractComponent {
  constructor(day, dayCount) {
    super();
    this._day = day;
    this._dayCount = dayCount;
  }

  getTemplate() {
    const date = this._day ? this._day : ``;
    const count = this._dayCount ? this._dayCount : ``;

    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="${moment(this._day).format()}">${date}</time>
      </div>
    </li>
    `;
  }
}
