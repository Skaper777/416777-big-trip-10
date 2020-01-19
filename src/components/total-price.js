import {AbstractComponent} from './abstract';
import {renderTotalPrice} from "../utils";

export class TotalPrice extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
    this._price = renderTotalPrice(events);
  }

  getTemplate() {
    return `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._price}</span>
            </p>`;
  }
}
