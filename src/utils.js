import moment from 'moment';

// Метод сортировки по времени
export const sortByTime = (events) => {
  return events.slice().sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
};

// Метод сортировки по цене
export const sortByPrice = (events) => {
  return events.slice().sort((a, b) => b.price - a.price);
};

// Метод сортировки по дате
export const sortByDate = (events) => {
  return events.slice().sort((a, b) => a.dateFrom - b.dateFrom);
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
    const eventPrice = events[i].price;
    sumEventsPrice += eventPrice;

    events[i].offers.forEach((offer) => {
      const offersPrice = offer.price;
      sumOffers += offersPrice;
    });
  }
  return sumEventsPrice + sumOffers;
};

export const Position = {
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
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
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

