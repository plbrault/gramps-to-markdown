export default ({ person }) => {
  const preferredName = person.names.find(({ preferred }) => preferred);
  const surnames = preferredName.parts.filter(({ partType }) => partType === 'surname');
  const firstName = preferredName.parts.find(({ partType }) => partType === 'first');

  let formattedName = '';
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

  const birth = person.events.find(({ type }) => type === 'Birth');
  let formattedBirth = '';
  if (birth) {
    console.log(birth);
    if (birth.dateVal) {
      if (birth.dateVal.type) {
        formattedBirth += `${birth.dateVal.type} `;
      }
      formattedBirth += `${birth.dateVal.val} `;
    }
  } else {
    formattedBirth = 'Unknown';
  }

  return `# ${formattedName}
 
    * 🎂 Birth: ${formattedBirth}

 `;
}
