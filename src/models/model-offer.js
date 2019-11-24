export class ModelOffer {
  constructor(data) {
    this.type.name = data.type;
    this.offers = data.offers.map((offer) => {
      return {
        name: offer.title,
        type: offer.type,
        price: offer.price,
        check: offer.accepted,
      };
    });
  }

  static parseOffer(data) {
    return new ModelOffer(data);
  }

  static parseOffers(data) {
    return data.map(ModelOffer.parseOffer);
  }
}
