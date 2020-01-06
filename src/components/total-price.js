import {renderTotalPrice} from "../utils";

export class TotalPrice {
  constructor(events) {
    this._events = events;
    this._price = renderTotalPrice(events);
  }

  getElement() {
    return this._price;
  }
}
