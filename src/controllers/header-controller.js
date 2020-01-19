import {TotalPrice} from '../components/total-price';
import {TripInfo} from '../components/trip-info';
import {render, position} from '../utils';

export class HeaderController {
  constructor(data) {
    this._price = new TotalPrice(data);
    this._tripInfo = new TripInfo(data);
  }

  _renderInfo() {
    const infoContainer = document.querySelector(`.trip-main__trip-info`);
    infoContainer.innerHTML = ``;

    render(infoContainer, this._tripInfo.getElement(), position.AFTERBEGIN);
    render(infoContainer, this._price.getElement(), position.BEFOREEND);
  }

  init() {
    const events = document.querySelectorAll(`.trip-events__item`);

    if (events.length > 0) {
      this._renderInfo();
    }
  }
}
