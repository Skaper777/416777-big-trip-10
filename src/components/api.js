import ModelDest from '../models/model-destination';
import ModelPoint from '../models/model-point';
import ModelOffer from '../models/model-offer';

const METHOD = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (res) => {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    throw new Error(`${res.status}: ${res.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(ModelPoint.parsePoints);
  }

  createPoint({point}) {
    return this._load({
      url: `points`,
      method: METHOD.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: METHOD.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: METHOD.DELETE});
  }

  getDestinations() {
    return this._load({url: `destinations`})
    .then(toJSON)
    .then(ModelDest.parseDestinations);
  }

  getOffers() {
    return this._load({url: `offers`})
    .then(toJSON)
    .then(ModelOffer.parseOffers);
  }

  _load({url, method = METHOD.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}
