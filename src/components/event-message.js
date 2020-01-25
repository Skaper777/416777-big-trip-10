import AbstractComponent from './abstract';
/**
 * Класс шаблона сообщения при пустом списке событий
 */
export default class EventMessage extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}
