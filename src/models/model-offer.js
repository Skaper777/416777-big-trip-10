/**
 * Класс модели офферов
 */
export default class ModelOffer {
  constructor(offer) {
    this.type = offer.type;
    this.offers = offer.offers.map((item) => {
      return {
        name: item.title,
        price: item.price
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
