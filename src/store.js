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
    return this._offers.map((element) => [element.type, element.offers]);
  }

  // установка списка городов
  setDestinations(destinations) {
    this._destinations = destinations;
  }

  // установка списка городов
  setOffers(offers) {
    this._offers = offers;
  }
}
