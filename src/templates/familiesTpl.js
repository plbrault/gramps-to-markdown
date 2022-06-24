import familyTpl from './familyTpl.js';

export default (families, mainPerson, { createLink, t }) => {
  let formattedFamilies = '';

  if (families.length > 0) {
    formattedFamilies += `## ${t('Families')}`;
    families.forEach((family) => {
      formattedFamilies += `\n${familyTpl(family, mainPerson, { createLink, t })}`;
    });
  }

  return formattedFamilies;
};
