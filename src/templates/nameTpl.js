export default (name) => {
  let formattedName = '**';

  if (name) {
    const surnames = name.parts.filter(({ partType }) => partType === 'surname');
    const firstName = name.parts.find(({ partType }) => partType === 'first');

    surnames.forEach((surname) => {
      if (surname.prefix) {
        formattedName += `${surname.value} `;
      }
      if (surname.value) {
        formattedName += `${surname.value} `;
      }
      if (surname.connector) {
        formattedName += `${surname.connector} `;
      }
    });
    formattedName = formattedName.slice(0, formattedName.length - 1);
    formattedName += `, ${firstName.value}`;
  } else {
    formattedName += 'Unknown';
  }

  formattedName += '**';

  return formattedName;
};
