import findPreferredName from './utilities/findPreferredName.js';
import nameTpl from './nameTpl.js';

export default (people, { createLink, t, language, addFrontmatter, extraFrontmatterFields }) => {
  let frontmatter = '';
  if (addFrontmatter) {
    frontmatter += '---\n';
    frontmatter += 'type: people\n';
    frontmatter += `language: ${language}\n`;
    Object.keys(extraFrontmatterFields).forEach((field) => {
      frontmatter += `${field}: ${extraFrontmatterFields[field]}\n`;
    });
    frontmatter += '---\n\n';
  }

  return (
  /* eslint-disable indent */
`${frontmatter}# ${t('All Individuals')}
${
  people
    .map((person) => `${createLink(person, nameTpl(findPreferredName(person), { t }))}`)
    .sort()
    .reduce((markdown, personName) => `${markdown}\n* ${personName}`, '')
}

`
  /* eslint-enable indent */
  );
};
