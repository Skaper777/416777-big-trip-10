import {AbstractComponent} from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export class Stats extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  init() {
    const moneyCtx = document.querySelector(`.statistics__chart--money`);
    const transportCtx = document.querySelector(`.statistics__chart--transport`);
    const timeCtx = document.querySelector(`.statistics__chart--time`);

    this._moneyChart = new Chart(moneyCtx, this._getConfig(this._getMoneyData(), `MONEY`, (value) => `€` + value));
    this._trasnportChart = new Chart(transportCtx, this._getConfig(this._getTransportData(), `TRANSPORT`, (value) => value + `x`));
    this._timeChart = new Chart(timeCtx, this._getConfig(this._getTimeData(), `TIME`, (value) => value + `H`));
  }

  _getMoneyData() {
    const data = this._events.reduce((obj, {type, price}) => {
      const name = type.name;
      const prevProp = obj[name] || 0;
      obj[name] = prevProp + price;

      return obj;
    }, {});

    return data;
  }

  _getTransportData() {
    const data = this._events.reduce((obj, {type}) => {
      if (type.type === `transport`) {
        const transport = type.name;
        const prevProp = obj[transport] || 0;
        obj[transport] = prevProp + 1;

        return obj;
      }

      return obj;
    }, {});

    return data;
  }

  _getTimeData() {
    const data = this._events.reduce((obj, {destination, time}) => {
      const dest = destination;
      const hours = time.durationHours;

      obj[dest] = hours;

      return obj;
    }, {});

    return data;
  }

  _getConfig(data, title, formatIcon) {
    const keys = Object.keys(data);

    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: keys,
        datasets: [{
          data: keys.map((key) => data[key]),
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
    return `<section class="statistics visually-hidden">
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
  </section>
    `;
  }
}
