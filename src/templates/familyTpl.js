import findEvent from './utilities/findEvent.js';
import findPreferredName from './utilities/findPreferredName.js';

import eventTpl from './eventTpl.js';
import nameTpl from './nameTpl.js';
import notesTpl from './notesTpl.js';

export default (family, mainPerson, { createLink }) => {
  const otherPerson = (mainPerson === family.father ? family.mother : family.father);
  const otherPersonName = createLink(otherPerson, nameTpl(findPreferredName(otherPerson)));
  const notes = notesTpl(family.notes, { titleMarkdown: '####' });

  let formattedChildren = '';
  if (family.children.length > 0) {
    formattedChildren += '\n#### Children\n';
    family.children.forEach((child) => {
      formattedChildren += `\n* ${createLink(child, nameTpl(findPreferredName(child)))}`;
    });
    formattedChildren += '\n';
  }

  let formattedEvents = '';
  if (family.events.length > 0) {
    formattedEvents += '\n#### Family Events\n';
    const marriage = findEvent(family, 'Marriage');
    if (marriage) {
      formattedEvents += `\n* 💒 Marriage: ${eventTpl(marriage)}`;
    }
    const otherEvents = family.events.filter(({ type }) => type !== 'Marriage');
    otherEvents.forEach((event) => {
      formattedEvents += `\n* ${event.type}: ${eventTpl(event)}`;
    });
    formattedEvents += '\n';
  }

  return (
    /* eslint-disable indent */
`\n### With ${otherPersonName}
${formattedEvents}${notes}${formattedChildren}
`
    /* eslint-enable indent */
  );
};
