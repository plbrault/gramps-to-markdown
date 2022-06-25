import findEvent from './utilities/findEvent.js';
import findPreferredName from './utilities/findPreferredName.js';

import eventTpl from './eventTpl.js';
import nameTpl from './nameTpl.js';
import notesTpl from './notesTpl.js';

export default (family, mainPerson, { createLink, t }) => {
  const otherPerson = (mainPerson === family.father ? family.mother : family.father);
  const otherPersonName = createLink(otherPerson, nameTpl(findPreferredName(otherPerson), { t }));
  const notes = notesTpl(family.notes, { titleMarkdown: '####' });

  let formattedChildren = '';
  if (family.children.length > 0) {
    formattedChildren += `\n#### ${t('Children')}\n`;
    family.children.forEach((child) => {
      formattedChildren += `\n* ${createLink(child, nameTpl(findPreferredName(child), { t }))}`;
    });
    formattedChildren += '\n';
  }

  let formattedEvents = '';
  if (family.events.length > 0) {
    formattedEvents += `\n#### ${t('Family Events')}\n`;
    const marriage = findEvent(family, 'Marriage');
    if (marriage) {
      formattedEvents += `\n* 💒 ${t('Marriage')}: ${eventTpl(marriage, { t })}`;
    }
    const otherEvents = family.events.filter(({ type }) => type !== 'Marriage');
    otherEvents.forEach((event) => {
      formattedEvents += `\n* ${t(event.type)}: ${eventTpl(event, { t })}`;
    });
    formattedEvents += '\n';
  }

  return (
    /* eslint-disable indent */
`\n### ${t('With')} ${otherPersonName}
${formattedEvents}${notes}${formattedChildren}
`
    /* eslint-enable indent */
  );
};
