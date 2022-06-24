import findEvent from './utilities/findEvent.js';
import findPreferredName from './utilities/findPreferredName.js';

import eventTpl from './eventTpl.js';
import familiesTpl from './familiesTpl.js';
import nameTpl from './nameTpl.js';
import notesTpl from './notesTpl.js';

// eslint-disable-next-line
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

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

  let allCitations = [];
  allCitations.push(...person.citations);
  person.names.forEach((aName) => {
    allCitations.push(...aName.citations);
  });
  person.events.forEach((event) => {
    allCitations.push(...event.citations);
  });
  person.parentIn.forEach((family) => {
    allCitations.push(...family.citations);
  });
  person.parentIn.forEach((family) => {
    allCitations.push(...family.citations);
  });
  allCitations = [...new Set(allCitations)];

  let allSources = [];
  allCitations.forEach((citation) => {
    allSources.push(citation.source);
  });
  allSources = [...new Set(allSources)];

  let formattedSources = '';
  if (allSources.length > 0) {
    formattedSources += '## Sources\n';
    allSources.forEach((source) => {
      formattedSources += '\n  * ';
      if (source.author) {
        formattedSources += source.author;
        if (source.title || source.pubInfo) {
          formattedSources += ', ';
        }
      }
      if (source.title) {
        formattedSources += `*${source.title}*`;
        if (source.pubInfo) {
          formattedSources += ', ';
        }
      }
      if (source.pubInfo) {
        if (typeof source.pubInfo === 'string' && source.pubInfo.match(urlRegex)) {
          formattedSources += `[${source.pubInfo}](${source.pubInfo})`;
        } else {
          formattedSources += source.pubInfo;
        }
      }
    });
  }

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

${notes}${families}${formattedSources}`
    /* eslint-enable indent */
  );
};
