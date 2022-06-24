import formatPlace from './formatPlace.js';

function formatEvent(event) {
  let formattedEvent = '';

  if (event.dateVal) {
    if (event.dateVal.type) {
      formattedEvent += `**${event.dateVal.type}** `;
    }
    formattedEvent += `**${event.dateVal.val}** `;
  }
  if (event.place) {
    formattedEvent += `in **${formatPlace(event.place)}**`;
  }

  return formattedEvent;
}

export default formatEvent;
