import moment from 'moment';

// Метод сортировки по времени
export const sortByTime = (data) => {
  return data.slice().sort((a, b) => (a.dateTo - a.dateFrom) - (b.dateTo - b.dateFrom));
};

// Метод сортировки по цене
export const sortByPrice = (data) => {
  return data.slice().sort((a, b) => a.price - b.price);
};

// Метод парсинга времени в мс.
export const parseDate = (value) => moment(value, `YYYY MMM DD`).valueOf();

// Метод сортировки по дате
export const sortByDate = (data) => {
  return data.slice().sort((a, b) => a.dateFrom - b.dateFrom);
};

// Метод получения случайного значения
export const getRandomValue = (min, max) => {
  return Math.round((Math.random() * (max - min)) + min);
};

// Метод получения случайного элемента
export const getRandomElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Метод получения массива со случайной длинной
export const getRandomList = (arr, value) => {
  let newList = arr.slice().sort(() => 0.5 - Math.random());
  newList.length = Math.round(Math.random() * value);
  return newList;
};

// Метод получения интервала по времени
const getInterval = (timeValue, unitOfTime) => timeValue < 10 ? `0${timeValue}${unitOfTime}` : `${timeValue}${unitOfTime}`;

// Метод получения длительности поездки
export const getDuration = (from, to) => {
  const days = moment(to).diff(moment(from), `days`);
  const hours = moment(to).diff(moment(from), `hours`) - days * 24;
  const minutes = moment(to).diff(moment(from), `minutes`) - days * 60 * 24 - hours * 60;

  const formattedInt = `${days > 0 ? getInterval(days, `D`) : ``} ${hours > 0 ? getInterval(hours, `H`) : ``} ${getInterval(minutes, `M`)}`;
  return formattedInt;
};

// Метод получения итоговой цены
export const renderTotalPrice = (events) => {
  let sumEventsPrice = 0;
  let sumOffers = 0;

  for (let i = 0; i < events.length; i++) {
    let eventPrice = events[i].price;
    sumEventsPrice += eventPrice;

    events[i].offers.forEach((offer) => {
      let offersPrice = offer.price;
      sumOffers += offersPrice;
    });
  }
  return sumEventsPrice + sumOffers;
};

export const position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

// Метод создания элемента
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

// Метод рендера элемента в контейнер
export const render = (container, element, place) => {
  switch (place) {
    case position.AFTERBEGIN:
      container.prepend(element);
      break;
    case position.BEFOREEND:
      container.append(element);
      break;
  }
};

// метод проверки типа события
export const getTitle = (type) => {
  switch (type) {
    case `taxi`:
      return `Taxi to`;

    case `bus`:
      return `Bus to`;

    case `train`:
      return `Train to`;

    case `ship`:
      return `Ship to`;

    case `transport`:
      return `Transport to`;

    case `drive`:
      return `Drive to`;

    case `flight`:
      return `Flight to`;

    case `check-in`:
      return `Check-in in`;

    case `sightseeing`:
      return `Sightseeing at`;

    case `restaurant`:
      return `Restaurant in`;

    default:
      return ``;
  }
};

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

