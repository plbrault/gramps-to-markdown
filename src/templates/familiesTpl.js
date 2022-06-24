import familyTpl from './familyTpl.js';

export default (families, mainPerson) => {
  let formattedFamilies = '';

  if (families.length > 0) {
    formattedFamilies += '## Families';
    families.forEach((family) => {
      formattedFamilies += `\n\n${familyTpl(family, mainPerson)}`;
    });
  }

  return formattedFamilies;
};
