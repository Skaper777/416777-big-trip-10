import moment from 'moment';

export const getRandomValue = (min, max) => {
  return Math.round((Math.random() * (max - min)) + min);
};

export const getRandomElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomList = (arr, value) => {
  let newList = arr.slice().sort(() => 0.5 - Math.random());
  newList.length = Math.round(Math.random() * value);
  return newList;
};

export const getTime = (value) => {
  return (value < 10 ? `0` + value : value);
};

const getInterval = (timeValue, unitOfTime) => timeValue < 10 ? `0${timeValue}${unitOfTime}` : `${timeValue}${unitOfTime}`;

export const getDuration = (from, to) => {
  const days = moment(to).diff(moment(from), `days`);
  const hours = moment(to).diff(moment(from), `hours`) - days * 24;
  const minutes = moment(to).diff(moment(from), `minutes`) - days * 60 * 24 - hours * 60;

  const formattedInt = `${days > 0 ? getInterval(days, `D`) : ``} ${hours > 0 ? getInterval(hours, `H`) : ``} ${getInterval(minutes, `M`)}`;
  return formattedInt;
};

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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

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

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

