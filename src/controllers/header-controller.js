import TotalPrice from '../components/total-price';
import TripInfo from '../components/trip-info';
import {render, Position} from '../utils';
/**
 * Класс контроллера шапки сайта
 */
export default class HeaderController {
  constructor(headerData) {
    this._price = new TotalPrice(headerData);
    this._tripInfo = new TripInfo(headerData);
  }

  // Метод отрисовки информации о поездке
  _renderInfo() {
    const infoContainer = document.querySelector(`.trip-main__trip-info`);
    infoContainer.innerHTML = ``;

    render(infoContainer, this._tripInfo.getElement(), Position.AFTERBEGIN);
    render(infoContainer, this._price.getElement(), Position.BEFOREEND);
  }

  // Метод инициализации
  init() {
    this._renderInfo();
  }
}
