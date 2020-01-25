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
  static parseDestination(data) {
    return new ModelDest(data);
  }

  // Метод создания всех пунктов
  static parseDestinations(data) {
    return data.map(ModelDest.parseDestination);
  }
}
