import familyTpl from './familyTpl.js';

export default (families, mainPerson, { createLink }) => {
  let formattedFamilies = '';

  if (families.length > 0) {
    formattedFamilies += '## Families';
    families.forEach((family) => {
      formattedFamilies += `\n${familyTpl(family, mainPerson, { createLink })}`;
    });
  }

  return formattedFamilies;
};
