import findPreferredName from './utilities/findPreferredName.js';
import nameTpl from './nameTpl.js';

export default (people, { createLink, t }) => (
  /* eslint-disable indent */
`# ${t('All Individuals')}
${
  people
    .map((person) => `${createLink(person, nameTpl(findPreferredName(person)))}`)
    .sort()
    .reduce((markdown, personName) => `${markdown}\n* ${personName}`, '')
}

`
  /* eslint-enable indent */
);
