import {AbstractComponent} from './abstract';

export class TripEvents extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
  </section>
    `;
  }
}
