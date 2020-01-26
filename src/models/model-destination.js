/**
 * Класс модели пункта назначения
 */
export default class ModelDest {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.photo = data.pictures;
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
