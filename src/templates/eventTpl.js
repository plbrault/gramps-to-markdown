import placeTpl from './placeTpl.js';

export default (event) => {
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
      formattedEvent += `in **${placeTpl(event.place)}**`;
    }
  } else {
    formattedEvent = '**Unknown**';
  }

  return formattedEvent;
};
