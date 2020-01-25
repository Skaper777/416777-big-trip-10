import AbstractComponent from './abstract';
/**
 * Класс шаблона меню
 */
export default class Menu extends AbstractComponent {
  constructor() {
    super();
    this._list = [{
      name: `Table`,
      active: true
    },
    {
      name: `Stats`,
      active: false
    }
    ];
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
