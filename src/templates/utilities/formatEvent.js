import formatPlace from './formatPlace.js';

function formatEvent(event) {
  let formattedEvent = '';

  if (event) {
    if (event.description) {
      formattedEvent += `**${event.description}** `;
      if (event.dateVal && !event.dateVal.type) {
        formattedEvent += 'on ';
      }
    }
    if (event.dateVal) {
      if (event.dateVal.type) {
        formattedEvent += `**${event.dateVal.type}** `;
      }
      formattedEvent += `**${event.dateVal.val}** `;
    }
    if (event.place) {
      formattedEvent += `in **${formatPlace(event.place)}**`;
    }
  } else {
    formattedEvent = '**Unknown**';
  }

  return formattedEvent;
}

export default formatEvent;
