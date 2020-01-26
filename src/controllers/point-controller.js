import {render, Position, Mode} from '../utils';
import Point from '../components/event';
import EditEvent from '../components/edit-form';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

export default class PointController {
  constructor(container, data, store, mode, onDataChange, onChangeView) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._data = data;
    this._store = store;
    this._point = new Point(data);
    this._editForm = new EditEvent(data, store);

    this.init(mode);
  }

  // Метод замены типа отображения события
  setDefaultView() {
    if (this._container.getElement().contains(this._editForm.getElement())) {
      this._container.getElement().replaceChild(this._point.getElement(), this._editForm.getElement());
    }
  }

  // Метод блокировки полей формы
  disableForm(textButton) {
    this._editForm.getElement().querySelectorAll(`form input, form select, form button, form checkbox`).forEach((item) => item.setAttribute(`disabled`, `disabled`));

    if (textButton === `Saving...`) {
      this._editForm.setSaveBtnText(textButton);
    } else {
      this._editForm.setDeleteBtnTxt(textButton);
    }
  }

  // Метод разблокировки формы
  unlockForm() {
    this._editForm.getElement().querySelectorAll(`form input, form select, form button, form checkbox`).forEach((item) => item.removeAttribute(`disabled`, `disabled`));
    this._editForm.setSaveBtnText(`Save`);
    this._editForm.setDeleteBtnTxt(`Delete`);
  }

  // Метод для обработки ошибок
  errorFormHandler() {
    this.unlockForm();
    this._editForm.getElement().style = `border-radius: 5px; border: 1px solid red`;
    this._editForm.getElement().classList.add(`shake`);
  }

  // Метод валидации форм формы
  _validateForm(text, evt) {
    evt.preventDefault();

    const form = this._editForm.getElement();
    form.style.position = `relative`;

    const error = document.createElement(`div`);
    const textBlock = document.createElement(`p`);

    error.appendChild(textBlock);
    textBlock.textContent = text;
    error.style = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180px;
      height: 50px;
      padding: 10px;
      border: 1px solid red;
      background: white;
      border-radius: 4px;
      position: absolute;
      left: calc(50% - 100px);
      top: 50px;
    `;

    error.classList.add(`error-block`);
    form.appendChild(error);

    setTimeout(() => {
      form.removeChild(form.querySelector(`.error-block`));
    }, 1500);
  }

  // Метод инициализации
  init(mode) {
    let currentView = this._point;
    let renderPosition = Position.BEFOREEND;

    if (mode === Mode.ADDING) {
      currentView = this._editForm;
      renderPosition = Position.AFTERBEGIN;
    }

    const times = this._editForm.getElement().querySelectorAll(`.event__input--time`);

    flatpickr(times[0], {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.dateFrom,
      enableTime: true,
      altFormat: `d/m/y H:i`,
    });

    flatpickr(times[1], {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.dateTo,
      enableTime: true,
      altFormat: `d/m/y H:i`,
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
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    // Обработчик отправки формы
    this._editForm.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const form = this._editForm.getElement();
        const formData = new FormData(form.querySelector(`.event--edit`));
        const offersDom = Array.from(form.querySelectorAll(`.event__offer-selector`));
        const destList = Array.from(form.querySelectorAll(`.datalist-option`)).map((it) => it.value);

        const entry = {
          'type': formData.get(`event-type`),
          'destination': {
            name: formData.get(`event-destination`),
            description: form.querySelector(`.event__destination-description`).textContent,
            pictures: [...form.querySelectorAll(`.event__photo`)].map((el) => {
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
          'is_favorite': form.querySelector(`.event__favorite-checkbox`).checked ? true : false
        };

        const checkDest = () => {
          return destList.find((item) => entry.destination.name === item);
        };

        if (entry.date_from > entry.date_to) {
          this._validateForm(`Wrong time`, evt);
        } else if (!checkDest()) {
          this._validateForm(`Wrong destination, choose from the list`, evt);
        } else {
          form.style = `border: none`;
          this.disableForm(`Saving...`);
          this._onDataChange(entry, mode === Mode.DEFAULT ? this._data : null, this);

          document.removeEventListener(`keydown`, onEscKeyDown);
        }
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

        this.disableForm(`Deleting...`);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._container.getElement(), currentView.getElement(), renderPosition);
  }
}
