/**
 * Класс модели событий
 */
export default class ModelPoint {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.typeOfType = ``;
    this.destination = data.destination;
    this.dateFrom = new Date(data.date_from);
    this.dateTo = new Date(data.date_to);
    this.price = data.base_price;
    this.offers = data.offers;
    this.isFavorite = data.is_favorite;

    this._getTransport();
  }

  // Метод проверки типа
  _getTransport() {
    if (this.type === `taxi` ||
        this.type === `bus` ||
        this.type === `train` ||
        this.type === `ship` ||
        this.type === `transport` ||
        this.type === `drive` ||
        this.type === `flight`) {
      this.typeOfType = `transport`;
    }

    return ``;
  }

  // Метод создания одного пункта
  static parsePoint(point) {
    return new ModelPoint(point);
  }

  // Метод создания всех пунктов
  static parsePoints(points) {
    return points.map(ModelPoint.parsePoint);
  }
}
