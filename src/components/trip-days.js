import AbstractComponent from './abstract';
/**
 * Класс шаблона списка дней
 */
export default class TripDays extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<ul class="trip-days">

  </ul>
  `;
  }
}
