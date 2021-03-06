export default (name, { t }) => {
  let formattedName = '**';

  if (name) {
    const surnames = name.parts.filter(({ partType }) => partType === 'surname');
    const firstName = name.parts.find(({ partType }) => partType === 'first');

    surnames.forEach((surname) => {
      if (surname.prefix) {
        formattedName += `${surname.prefix} `;
      }
      if (surname.value) {
        formattedName += `${surname.value} `;
      }
      if (surname.connector) {
        formattedName += `${surname.connector} `;
      }
    });
    formattedName = formattedName.slice(0, formattedName.length - 1);
    if (firstName) {
      formattedName += `, ${firstName.value}`;
    }
  } else {
    formattedName += t('Unknown');
  }

  formattedName += '**';

  return formattedName;
};
