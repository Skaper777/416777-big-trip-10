export class ModelPoint {
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

  toRAW() {
    return {
      'id': this.id,
      'base_price': this.price,
      'date_from': this.dateFrom,
      'date_to': this.dateTo,
      'destination': this.destination,
      'is_favorite': this.isFavorite,
      'offers': this.offers,
      'type': this.type
    };
  }

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

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }

  static clone(data) {
    return new ModelPoint(data.toRAW());
  }
}
