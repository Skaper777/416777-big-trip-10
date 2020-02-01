import AbstractComponent from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
/**
 * Класс шаблона статистики
 */
export default class Statistic extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  // Метод инициализации
  init() {
    const moneyCtx = document.querySelector(`.statistics__chart--money`);
    const transportCtx = document.querySelector(`.statistics__chart--transport`);
    const timeCtx = document.querySelector(`.statistics__chart--time`);

    this._moneyChart = new Chart(moneyCtx, this._getConfig(this._getMoneyData(), `MONEY`, (value) => `€` + value));
    this._trasnportChart = new Chart(transportCtx, this._getConfig(this._getTransportData(), `TRANSPORT`, (value) => value + `x`));
    this._timeChart = new Chart(timeCtx, this._getConfig(this._getTimeData(), `TIME`, (value) => value + `H`));
  }

  // Метод поулчения данных по стоимости
  _getMoneyData() {
    const data = this._events.reduce((object, {
      type,
      price
    }) => {
      const name = type;
      const prevProp = object[name] || 0;
      object[name] = prevProp + price;

      return object;
    }, {});

    return data;
  }

  // Метод получения данных по транспорту
  _getTransportData() {
    const data = this._events.reduce((object, {
      type,
      typeOfType
    }) => {
      if (typeOfType === `transport`) {
        const transport = type;
        const prevProp = object[transport] || 0;
        object[transport] = prevProp + 1;

        return object;
      }

      return object;
    }, {});

    return data;
  }

  // Метод получения данных по времени
  _getTimeData() {
    const data = this._events.reduce((object, {
      destination,
      dateFrom,
      dateTo
    }) => {
      const dest = destination.name;
      const getDurationHours = () => {
        let time = dateTo - dateFrom;
        return Math.floor(time / 3600000);
      };
      const hours = getDurationHours();

      object[dest] = hours;

      return object;
    }, {});

    return data;
  }

  // Метод получения настроек плагина
  _getConfig(configData, title, formatIcon) {
    const keys = Object.keys(configData);

    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: keys,
        datasets: [{
          data: keys.map((key) => configData[key]),
          backgroundColor: `white`,
          borderColor: `grey`,
          borderWidth: 0,
          hoverBorderWidth: 1,
        }],
      },
      options: {
        plugins: {
          datalabels: {
            formatter: formatIcon,
            font: {
              size: 15
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
          }
        },
        scales: {
          yAxes: [{
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false,
        },
        title: {
          display: true,
          position: `left`,
          text: title,
          fontSize: 20,
        },
      }
    };
  }

  getTemplate() {
    return `<div>
    <h2 class="visually-hidden">Trip statistics</h2>
    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
    </div>`;
  }
}
