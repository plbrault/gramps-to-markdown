import placeTpl from './placeTpl.js';

export default (event, { t }) => {
  let formattedEvent = '';

  if (event) {
    if (event.description) {
      formattedEvent += `**${event.description}**: `;
    }
    if (event.dateVal) {
      if (event.dateVal.type) {
        formattedEvent += `**${t(event.dateVal.type)}** `;
      }
      formattedEvent += `**${event.dateVal.val}** `;
    }
    if (event.place) {
      formattedEvent += `${t('in')} **${placeTpl(event.place)}**`;
    }
  } else {
    formattedEvent = '**Unknown**';
  }

  return formattedEvent;
};
