import findEvent from './utilities/findEvent.js';
import findPreferredName from './utilities/findPreferredName.js';

import eventTpl from './eventTpl.js';
import familiesTpl from './familiesTpl.js';
import nameTpl from './nameTpl.js';
import notesTpl from './notesTpl.js';

// eslint-disable-next-line
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

export default (person, { createLink, t, language, addFrontmatter, extraFrontmatterFields }) => {
  const name = nameTpl(findPreferredName(person));
  const birth = eventTpl(findEvent(person, 'Birth'), { t });
  const death = eventTpl(findEvent(person, 'Death'), { t });
  const fatherName = createLink(
    person.childOf[0]?.father,
    nameTpl(findPreferredName(person.childOf[0]?.father)),
  );
  const motherName = createLink(
    person.childOf[0]?.mother,
    nameTpl(findPreferredName(person.childOf[0]?.mother)),
  );
  const notes = notesTpl(person.notes);
  const families = familiesTpl(person.parentIn, person, { createLink, t });

  let formattedOtherNames = '';
  const otherNames = person.names.filter(({ preferred }) => !preferred);
  if (otherNames.length > 0) {
    formattedOtherNames += `\n## ${t('Other Names')}\n`;
    formattedOtherNames += otherNames.reduce((markdown, otherName) => (
      `${markdown}\n* ${nameTpl(otherName)}`
    ), '');
    formattedOtherNames += '\n';
  }

  let formattedOtherEvents = '';
  const otherEvents = person.events.filter(({ type }) => type !== 'Birth' && type !== 'Death');
  formattedOtherEvents = otherEvents.reduce((markdown, event) => (
    `${markdown}\n* ${t(event.type)}: ${eventTpl(event, { t })}  `
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
    formattedSources += `## ${t('Sources')}\n`;
    allSources.forEach((source) => {
      formattedSources += '\n* ';
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
      const sourceCitations = allCitations.filter(
        ({ source: citationSource, page }) => citationSource === source && page,
      );
      sourceCitations.forEach((citation) => {
        formattedSources += '\n  * ';
        if (typeof citation.page === 'string' && citation.page.match(urlRegex)) {
          formattedSources += `[${citation.page}](${citation.page})`;
        } else {
          formattedSources += citation.page;
        }
      });
    });
  }

  let frontmatter = '';
  if (addFrontmatter) {
    frontmatter += '---\n';
    frontmatter += 'type: person\n';
    frontmatter += `language: ${language}\n`;
    frontmatter += `id: ${person.id}\n`;
    frontmatter += `name: ${name.replace(/\*\*/g, '')}\n`;
    Object.keys(extraFrontmatterFields).forEach((field) => {
      frontmatter += `${field}: ${extraFrontmatterFields[field]}\n`;
    });
    frontmatter += '---\n\n';
  }

  return (
    /* eslint-disable indent */
`${frontmatter}# ${name}
${formattedOtherNames}
## ${t('Life Events')}  

* 🎂 ${t('Birth')}: ${birth}  
* 🪦 ${t('Death')}: ${death}  ${formattedOtherEvents}

## Parents

* 👨 ${t('Father')}: ${fatherName}  
* 👩 ${t('Mother')}: ${motherName}  

${notes}${families}${formattedSources}
`
    /* eslint-enable indent */
  );
};
