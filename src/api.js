import ModelDest from './models/model-destination';
import ModelPoint from './models/model-point';
import ModelOffer from './models/model-offer';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

// Метод проверки статуса ответа сервера
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

// Метод для получения ответа в формате JSON
const toJSON = (response) => {
  return response.json();
};
/**
 * Класс для взаимодействия с API
 */
export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  // Метод получения списка событий
  getPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(ModelPoint.parsePoints);
  }

  // Метод отправки на сервер нового события
  createPoint(pointData) {
    return this._load({
      url: `points/`,
      method: Method.POST,
      body: JSON.stringify(pointData),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  // Метод обновления события на сервере
  updatePoint(id, pointData) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(pointData),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  // Метод удаления события на сервере
  deletePoint(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  // Метод поулчения списка городов
  getDestinations() {
    return this._load({url: `destinations`})
    .then(toJSON)
    .then(ModelDest.parseDestinations);
  }

  // Метод получения списка офферов
  getOffers() {
    return this._load({url: `offers`})
    .then(toJSON)
    .then(ModelOffer.parseOffers);
  }

  // Метод загрузки
  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
