/**
 * Класс модели событий
 */
export default class ModelPoint {
  constructor(point) {
    this.id = point.id;
    this.type = point.type;
    this.typeOfType = ``;
    this.destination = point.destination;
    this.dateFrom = new Date(point.date_from);
    this.dateTo = new Date(point.date_to);
    this.price = point.base_price;
    this.offers = point.offers;
    this.isFavorite = point.is_favorite;

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
