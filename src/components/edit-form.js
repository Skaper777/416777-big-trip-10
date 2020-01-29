import AbstractComponent from './abstract.js';
import {getTitle} from '../utils';
import moment from 'moment';
/**
 * Класс шаблона редактирования события
 */
export default class EditEvent extends AbstractComponent {
  constructor({type, destination, dateFrom, dateTo, price, offers, isFavorite}, store) {
    super();
    this._type = type;
    this._destination = destination;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._price = price;
    this._offers = offers;
    this._description = destination.description;
    this._photos = destination.pictures;
    this._offersList = store.getOffers();
    this._destinations = store.getDestinations();
    this._isFavorite = isFavorite;
    this._currentOffers = this._getCurrentOffers();

    this._changeDestination();
    this._changeType();
  }

  // метод изменения текста кнопки сохраниения
  setSaveBtnText(text) {
    this.getElement().querySelector(`.event__save-btn`).textContent = text;
  }

  // метод изменения текста кнопки удаления
  setDeleteBtnTxt(text) {
    this.getElement().querySelector(`.event__reset-btn`).textContent = text;
  }

  // метод получения актуальных офферов
  _getCurrentOffers() {
    return this._offersList.find((it) => it[0] === this._type)[1]
    .map((it) => it);
  }

  // метод проверки отмеченных офферов
  _checkForChecked(offer) {
    let checked = false;

    this._offers.forEach((element) => {
      if (offer.name === element.title) {
        checked = true;
      }
    });

    return checked ? `checked` : ``;
  }

  // метод ререндеринга офферов от типа
  _changeType() {
    const checkboxes = this.getElement().querySelectorAll(`.event__type-input`);

    for (let i = 0; i < checkboxes.length; i++) {
      if (this._type === checkboxes[i].value) {
        checkboxes[i].checked = true;
      }

      checkboxes[i].addEventListener(`click`, (evt) => {
        if (evt.target === checkboxes[i]) {
          checkboxes[i].checked = true;
          this._type = checkboxes[i].value;
          this.getElement().querySelector(`.event__type-icon`).src = `img/icons/${this._type}.png`;
          this.getElement().querySelector(`.event__type-output`).textContent = `${getTitle(this._type)}`;

          this.getElement().querySelector(`.event__available-offers`).innerHTML = this._getCurrentOffers().map((item) =>
            `<div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${item.name}-1" type="checkbox" name="${item.name}" ${item.check ? `checked` : ``}>
                    <label class="event__offer-label" for="event-offer-${item.name}-1">
                      <span class="event__offer-title">${item.name}</span>
                      &plus;
                      &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
                    </label>
                  </div>`).join(``);
        }
      });
    }
  }

  // метод ререндеринга описания и фото от пункта назначения
  _changeDestination() {
    const el = this.getElement().querySelector(`.event__input--destination`);

    el.addEventListener(`change`, (e) => {
      let targ = this._destinations.find((it) => it.name === e.target.value);

      if (!targ) {
        e.preventDefault();
        this.getElement().style.position = `relative`;
        this.getElement().querySelector(`.wrong-destination`).style = `display: block; color: red; position: absolute; top: 40px`;
      } else {
        this.getElement().querySelector(`.wrong-destination`).style = `display: none`;
        this.getElement().querySelector(`.event__destination-description`).textContent = targ.description;
        this.getElement().querySelector(`.event__photos-tape`).innerHTML = targ.photo.map((it) => `<img class="event__photo" src="${it.src}" alt="Event photo">`).join(``);
      }
    });
  }

  getTemplate() {
    return `<li class="trip-events__item">
  <form class="event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
              <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight">
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${getTitle(this._type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._destination.name}" list="destination-list-1" required>
        <datalist id="destination-list-1">
          ${this._destinations.map((dest) => `<option class="datalist-option" value="${dest.name}"></option>`).join(``)}
        </datalist>
        <p class="wrong-destination" style="display: none">Wrong destination, choose from the list</p>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(this._dateFrom).format(`DD/MM/YY hh:mm`)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(this._dateTo).format(`DD/MM/YY hh:mm`)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" name="event-price" value=${this._price} require>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>

      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>

    <section class="event__details">

    ${ this._currentOffers.length ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${this._currentOffers.map((item) =>
    `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${item.name}-1" type="checkbox" name="${item.name}" ${this._checkForChecked(item)}>
            <label class="event__offer-label" for="event-offer-${item.name}-1">
              <span class="event__offer-title">${item.name}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
            </label>
          </div>`).join(``)}
        </div>
      </section>` : ``}

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${this._description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${this._photos[0].src ? this._photos.map((item) => `<img class="event__photo" src="${item.src}" alt="Event photo">`).join(``) : ``}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>
  `;
  }
}
