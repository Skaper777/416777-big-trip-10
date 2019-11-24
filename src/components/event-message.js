import {AbstractComponent} from './abstract';

export class EventMessage extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}
