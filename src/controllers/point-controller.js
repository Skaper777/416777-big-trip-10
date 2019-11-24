import {render, position, Mode} from '../utils';
import {Point} from '../components/event';
import {EditEvent} from '../components/edit-form';
import {EventMessage} from '../components/event-message';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {getPhoto} from '../data';

export class PointController {
  constructor(container, data, mode, onDataChange, onChangeView) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._data = data;
    this._point = new Point(data);
    this._editForm = new EditEvent(data);

    this.init(mode);
    this._onTypeHandler();
  }

  _onTypeHandler() {
    const checkboxes = this._editForm.getElement().querySelectorAll(`.event__type-input`);

    for (let i = 0; i < checkboxes.length; i++) {
      if (this._editForm._type.name === checkboxes[i].value) {
        checkboxes[i].checked = true;
      }

      checkboxes[i].addEventListener(`click`, (evt) => {
        if (evt.target === checkboxes[i]) {
          checkboxes[i].checked = true;
          this._editForm._type.name = checkboxes[i].value;
          this._editForm.getElement().querySelector(`.event__type-icon`).src = `img/icons/${this._editForm._type.name}.png`;
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
      defaultDate: this._data.time.timeIn,
      enableTime: true,
      altFormat: `d-m-y H:i`,
    });

    flatpickr(times[1], {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.time.timeOut,
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
          type: {
            name: formData.get(`event-type`)
          },
          destination: formData.get(`event-destination`),
          time: {
            timeIn: formData.get(`event-start-time`),
            timeOut: formData.get(`event-end-time`),
            durationHours: ``,
            durationMinutes: ``,

            getDurationHours() {
              let time = moment(this.timeOut).format(`x`) - moment(this.timeIn).format(`x`);
              this.durationHours = Math.floor(time / 3600000);
              this.durationMinutes = Math.floor((time / 60000) - this.durationHours * 60);
              return this.durationHours;
            },

            getDurationMinutes() {
              return this.durationMinutes;
            }
          },
          price: formData.get(`event-price`),
          offers: offersDom.map((item) => (
            {
              name: item.querySelector(`.event__offer-checkbox`).name,
              type: item.querySelector(`.event__offer-title`).textContent,
              price: item.querySelector(`.event__offer-price`).textContent,
              check: item.querySelector(`.event__offer-checkbox`).checked
            }
          )),
          photo: getPhoto(),
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `).sort(() => 0.5 - Math.random()),

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
