import findEvent from './utilities/findEvent.js';
import findPreferredName from './utilities/findPreferredName.js';
import formatEvent from './utilities/formatEvent.js';
import formatName from './utilities/formatName.js';
import family from './family.js';

export default ({ person }) => {
  const name = formatName(findPreferredName(person));
  const birth = formatEvent(findEvent(person, 'Birth'));
  const death = formatEvent(findEvent(person, 'Death'));
  const fatherName = formatName(findPreferredName(person.childOf[0]?.father));
  const motherName = formatName(findPreferredName(person.childOf[0]?.mother));

  const otherEvents = person.events.filter(({ type }) => type !== 'Birth' && type !== 'Death');
  const formattedOtherEvents = otherEvents.reduce((markdown, event) => (
    `${markdown}\n  * ${event.type}: ${formatEvent(event)}`
  ), '');

  return (`# ${name}

## Life Events  

  * 🎂 Birth: ${birth}
  * 🪦 Death: ${death}${formattedOtherEvents}

## Parents

  * 👨 Father: ${fatherName}
  * 👩 Mother: ${motherName}

## Families

 `);
}
