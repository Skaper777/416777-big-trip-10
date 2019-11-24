import {renderTotalPrice} from "../utils";

export class TotalPrice {
  constructor() {
    this._price = renderTotalPrice();
  }

  getElement() {
    return this._price;
  }
}
