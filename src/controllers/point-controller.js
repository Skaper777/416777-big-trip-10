import {render, position, Mode} from '../utils';
import {Point} from '../components/event';
// import {modelPoint} from '../models/model-point';
import {EditEvent} from '../components/edit-form';
import {EventMessage} from '../components/event-message';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

export class PointController {
  constructor(container, data, store, mode, onDataChange, onChangeView) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._data = data;
    this._store = store;
    this._point = new Point(data);
    this._editForm = new EditEvent(data, store);

    this.init(mode);
    this._onTypeHandler();
  }

  _onTypeHandler() {
    const checkboxes = this._editForm.getElement().querySelectorAll(`.event__type-input`);

    for (let i = 0; i < checkboxes.length; i++) {
      if (this._editForm._type === checkboxes[i].value) {
        checkboxes[i].checked = true;
      }

      checkboxes[i].addEventListener(`click`, (evt) => {
        if (evt.target === checkboxes[i]) {
          checkboxes[i].checked = true;
          this._editForm._type = checkboxes[i].value;
          this._editForm.getElement().querySelector(`.event__type-icon`).src = `img/icons/${this._editForm._type}.png`;
          this._editForm.getElement().querySelector(`.event__type-output`).textContent = `${this._editForm._getTitle()}`;
        }
      });
    }
  }

  _renderEventMessage() {
    const message = new EventMessage();
    const mainContainer = document.querySelector(`.page-main`);

    render(mainContainer, message.getElement(), position.AFTERBEGIN);
  }

  _checkLengthTrip() {
    const points = document.querySelectorAll(`.event`);

    if (points.length === 0) {
      document.querySelector(`.trip-events`).remove();
      this._renderEventMessage();
    }
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._editForm.getElement())) {
      this._container.getElement().replaceChild(this._point.getElement(), this._editForm.getElement());
    }
  }

  init(mode) {
    let currentView = this._point;
    let renderPosition = position.BEFOREEND;

    if (mode === Mode.ADDING) {
      currentView = this._editForm;
      renderPosition = position.AFTERBEGIN;
    }

    const times = this._editForm.getElement().querySelectorAll(`.event__input--time`);

    flatpickr(times[0], {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.dateFrom,
      enableTime: true,
      altFormat: `d-m-y H:i`,
    });

    flatpickr(times[1], {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.dateTo,
      enableTime: true,
      altFormat: `d-m-y H:i`,
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.getElement().replaceChild(this._point.getElement(), this._editForm.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._point.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._onChangeView();
        this._container.getElement().replaceChild(this._editForm.getElement(), this._point.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._editForm.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._container.getElement().replaceChild(this._point.getElement(), this._editForm.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._editForm.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(this._editForm.getElement().querySelector(`.event--edit`));
        const offersDom = Array.from(this._editForm.getElement().querySelectorAll(`.event__offer-selector`));

        const entry = {
          'type': formData.get(`event-type`),
          'destination': {
            name: formData.get(`event-destination`),
            description: document.querySelector(`.event__destination-description`).textContent,
            pictures: [...document.querySelectorAll(`.event__photo`)].map((el) => {
              return {src: el.src, description: el.alt};
            })
          },
          'date_from': formData.get(`event-start-time`),
          'date_to': formData.get(`event-end-time`),
          'base_price': +formData.get(`event-price`),
          'offers': offersDom.filter((item) => item.querySelector(`.event__offer-checkbox`).checked).map((item) => (
            {
              title: item.querySelector(`.event__offer-title`).textContent,
              price: +item.querySelector(`.event__offer-price`).textContent
            }
          )),
          'photo': Array.from(document.querySelectorAll(`.event__photo`)).map((img) => img),
          'description': document.querySelector(`.event__destination-description`).textContent,
          'is_favorite': false
        };

        this._onDataChange(entry, mode === Mode.DEFAULT ? this._data : null);

        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._editForm.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (e) => {
        if (mode === Mode.DEFAULT) {
          e.preventDefault();
          this._onDataChange(null, this._data);
        } else {
          this._onDataChange(null, null);
        }

        this._checkLengthTrip();
      });

    render(this._container.getElement(), currentView.getElement(), renderPosition);
  }
}
