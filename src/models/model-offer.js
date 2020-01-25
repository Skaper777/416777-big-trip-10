/**
 * Класс модели офферов
 */
export default class ModelOffer {
  constructor(data) {
    this.type = data.type;
    this.offers = data.offers.map((offer) => {
      return {
        name: offer.title,
        price: offer.price,
        check: false,
      };
    });
  }

  // Метод создания одного пункта
  static parseOffer(data) {
    return new ModelOffer(data);
  }

  // Метод создания всех пунктов
  static parseOffers(data) {
    return data.map(ModelOffer.parseOffer);
  }
}
