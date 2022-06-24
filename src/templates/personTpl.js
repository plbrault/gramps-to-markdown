import findEvent from './utilities/findEvent.js';
import findPreferredName from './utilities/findPreferredName.js';
import eventTpl from './eventTpl.js';
import familiesTpl from './familiesTpl.js';
import nameTpl from './nameTpl.js';
import notesTpl from './notesTpl.js';

export default (person) => {
  const name = nameTpl(findPreferredName(person));
  const birth = eventTpl(findEvent(person, 'Birth'));
  const death = eventTpl(findEvent(person, 'Death'));
  const fatherName = nameTpl(findPreferredName(person.childOf[0]?.father));
  const motherName = nameTpl(findPreferredName(person.childOf[0]?.mother));
  const notes = notesTpl(person.notes);
  const families = familiesTpl(person.parentIn, person);

  let formattedOtherNames = '';
  const otherNames = person.names.filter(({ preferred }) => !preferred);
  if (otherNames.length > 0) {
    formattedOtherNames += '\n## Other Names';
    formattedOtherNames += otherNames.reduce((markdown, otherName) => (
      `${markdown}\n  * ${nameTpl(otherName)}`
    ), '');
  }

  let formattedOtherEvents = '';
  const otherEvents = person.events.filter(({ type }) => type !== 'Birth' && type !== 'Death');
  formattedOtherEvents = otherEvents.reduce((markdown, event) => (
    `${markdown}\n  * ${event.type}: ${eventTpl(event)}`
  ), '');

  return (
    /* eslint-disable indent */
`# ${name}
${formattedOtherNames}

## Life Events  

  * 🎂 Birth: ${birth}
  * 🪦 Death: ${death}${formattedOtherEvents}

## Parents

  * 👨 Father: ${fatherName}
  * 👩 Mother: ${motherName}

${notes}${families}

`
    /* eslint-enable indent */
  );
};