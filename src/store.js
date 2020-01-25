/**
 * Класс состояния для хранения списков городов и офферов
 */
export default class Store {
  constructor() {
    this._destinations = [];
    this._offers = [];
  }

  // получение списка городов
  getDestinations() {
    return this._destinations;
  }

  // получение списка офферов
  getOffers() {
    return this._offers.map((el) => [el.type, el.offers]);
  }

  // установка списка городов
  setDestinations(data) {
    this._destinations = data;
  }

  // установка списка городов
  setOffers(data) {
    this._offers = data;
  }
}
