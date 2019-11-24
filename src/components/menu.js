import {AbstractComponent} from './abstract';

export class Menu extends AbstractComponent {
  constructor({list}) {
    super();
    this._list = list;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${this._list.map((item) => `
    <a class="trip-tabs__btn ${item.active ? `trip-tabs__btn--active` : ``}" href="#">${item.name}</a>
    `).join(``)}
    </nav>
  `;
  }
}
