export class ModelDest {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.photo = data.pictures;
  }

  static parseDestination(data) {
    return new ModelDest(data);
  }

  static parseDestinations(data) {
    return data.map(ModelDest.parseDestination);
  }
}
