import TotalPrice from '../components/total-price';
import TripInfo from '../components/trip-info';
import {render, position} from '../utils';
/**
 * Класс контроллера шапки сайта
 */
export default class HeaderController {
  constructor(data) {
    this._price = new TotalPrice(data);
    this._tripInfo = new TripInfo(data);
  }

  // Метод отрисовки информации о поездке
  _renderInfo() {
    const infoContainer = document.querySelector(`.trip-main__trip-info`);
    infoContainer.innerHTML = ``;

    render(infoContainer, this._tripInfo.getElement(), position.AFTERBEGIN);
    render(infoContainer, this._price.getElement(), position.BEFOREEND);
  }

  // Метод инициализации
  init() {
    const events = document.querySelectorAll(`.trip-events__item`);

    if (events.length > 0) {
      this._renderInfo();
    }
  }
}
