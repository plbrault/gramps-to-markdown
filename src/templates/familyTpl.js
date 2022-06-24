import findEvent from './utilities/findEvent.js';
import findPreferredName from './utilities/findPreferredName.js';

import eventTpl from './eventTpl.js';
import nameTpl from './nameTpl.js';
import notesTpl from './notesTpl.js';

export default (family, mainPerson) => {
  const otherPerson = (mainPerson === family.father ? family.mother : family.father);
  const otherPersonName = nameTpl(findPreferredName(otherPerson));
  const notes = notesTpl(family.notes, { titleMarkdown: '####' });

  let formattedEvents = '';
  if (family.events.length > 0) {
    formattedEvents += '#### Family Events\n';
    const marriage = findEvent(family, 'Marriage');
    if (marriage) {
      formattedEvents += `\n  * 💒 Marriage: ${eventTpl(marriage)}`;
    }
    const otherEvents = family.events.filter(({ type }) => type !== 'Marriage');
    otherEvents.forEach((event) => {
      formattedEvents += `\n  * ${event.type}: ${eventTpl(event)}`;
    });
    formattedEvents += '\n';
  }

  let formattedChildren = '';
  if (family.children.length > 0) {
    formattedChildren += '#### Children\n';
    family.children.forEach((child) => {
      formattedChildren += `\n  * ${nameTpl(findPreferredName(child))}`;
    });
  }

  return (
    /* eslint-disable indent */
`### With ${otherPersonName}

${formattedEvents}${formattedChildren}${notes}
`
    /* eslint-enable indent */
  );
};
