/**
 * Класс модели пункта назначения
 */
export default class ModelDest {
  constructor(destination) {
    this.name = destination.name;
    this.description = destination.description;
    this.photo = destination.pictures;
  }

  // Метод создания одного пункта
  static parseDestination(destination) {
    return new ModelDest(destination);
  }

  // Метод создания всех пунктов
  static parseDestinations(destinations) {
    return destinations.map(ModelDest.parseDestination);
  }
}
