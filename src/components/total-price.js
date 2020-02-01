import AbstractComponent from './abstract';
import {renderTotalPrice} from "../utils";
/**
 * Класс шаблона итоговой цены
 */
export default class TotalPrice extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
    this._price = renderTotalPrice(events);
  }

  getTemplate() {
    return `<p class="trip-info__cost">
              ${this._events.length ? `Total: &euro;&nbsp;` : ``}<span class="trip-info__cost-value">${this._events.length ? this._price : ``}</span>
            </p>`;
  }
}
