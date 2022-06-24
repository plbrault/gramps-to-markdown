import findPreferredName from './utilities/findPreferredName.js';
import nameTpl from './nameTpl.js';

export default (family, mainPerson) => {
  const otherPerson = (mainPerson === family.father ? family.mother : family.father);

  const otherPersonName = nameTpl(findPreferredName(otherPerson));

  return (
    /* eslint-disable indent */
`### With ${otherPersonName}
`
    /* eslint-enable indent */
  );
};
