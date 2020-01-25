import {createElement} from '../utils';
/**
 * Абстрактный родительский класс
 */
export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
  }

  // метод получения элемента
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  // метод удаления элемента
  removeElement() {
    this._element.remove();
    this._element = null;
  }

  // получение шаблона элемента
  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }
}
