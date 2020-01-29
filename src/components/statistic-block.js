import AbstractComponent from './abstract';
/**
 * Класс контейнера статистики
 */
export default class StatisticBlock extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="statistics visually-hidden">

    </div>`;
  }
}
