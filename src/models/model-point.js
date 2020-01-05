export class ModelPoint {
  constructor(data) {
    this.id = data.id;
    this.type = {
      name: data.type,
      type: ``
    };
    this.destination = data.destination.name;
    this.description = data.destination.description;
    this.photo = data.destination.pictures;
    this.time = {
      timeIn: new Date(data.date_from),
      timeOut: new Date(data.date_to),
      durationHours: ``,
      durationMinutes: ``,

      getDurationHours() {
        let time = this.timeOut - this.timeIn;
        this.durationHours = Math.floor(time / 3600000);
        this.durationMinutes = Math.floor((time / 60000) - this.durationHours * 60);
        return this.durationHours;
      },

      getDurationMinutes() {
        return this.durationMinutes;
      }
    };
    this.price = data.base_price;
    this.offers = data.offers;
    this.isFavorite = data.is_favorite;

    this._getTransport();
  }

  _getTransport() {
    if (this.type.name === `taxi` ||
        this.type.name === `bus` ||
        this.type.name === `train` ||
        this.type.name === `ship` ||
        this.type.name === `transport` ||
        this.type.name === `drive` ||
        this.type.name === `flight`) {
      this.type.type = `transport`;
    }

    return ``;
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}
