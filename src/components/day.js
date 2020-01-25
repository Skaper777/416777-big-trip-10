import AbstractComponent from './abstract';
/**
 * Класс шаблона для одного дня
 */
export default class Day extends AbstractComponent {
  constructor(day, dayCount) {
    super();
    this._day = day;
    this._dayCount = dayCount;
  }

  getTemplate() {
    const date = this._day ? this._day : ``;
    const count = this._dayCount ? this._dayCount : ``;
    const formatDate = date.slice(5);

    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="${date ? date : ``}">${date ? formatDate : ``}</time>
      </div>
    </li>
    `;
  }
}
