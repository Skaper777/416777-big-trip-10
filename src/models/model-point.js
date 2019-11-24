export class ModelPoint {
  constructor(data) {
    this.id = data.id;
    this.type.name = data.type;
    this.destination = data.destination.name;
    this.description = data.destination.description;
    this.photo = data.destination.pictures;
    this.time = {
      timeIn: new Date(data.date_from),
      timeOut: new Date(data.date_to)
    };
    this.price = data.base_price;
    this.offers = data.offers.map((offer) => {
      return {
        name: offer.title,
        type: offer.type,
        price: offer.price,
        check: offer.accepted,
      };
    });
    this.isFavorite = data.is_favorite;
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}
