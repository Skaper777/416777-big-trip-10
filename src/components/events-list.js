import AbstractComponent from './abstract';
/**
 *  Класс шаблона списка событий
 */
export default class EventsList extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<ul class="trip-events__list">

    </ul>
    `;
  }
}
