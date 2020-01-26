/**
 * Класс модели офферов
 */
export default class ModelOffer {
  constructor(data) {
    this.type = data.type;
    this.offers = data.offers.map((offer) => {
      return {
        name: offer.title,
        price: offer.price
      };
    });
  }

  // Метод создания одного пункта
  static parseOffer(offer) {
    return new ModelOffer(offer);
  }

  // Метод создания всех пунктов
  static parseOffers(offers) {
    return offers.map(ModelOffer.parseOffer);
  }
}
