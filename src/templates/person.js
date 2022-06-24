import formatEvent from './utilities/formatEvent.js';
import formatName from './utilities/formatName.js';
import findPreferredName from './utilities/findPreferredName.js';

export default ({ person }) => {
  const formattedName = formatName(findPreferredName(person));

  const birth = person.events.find(({ type }) => type === 'Birth');
  let formattedBirth;
  if (birth) {
    formattedBirth = formatEvent(birth);
  } else {
    formattedBirth = '**Unknown**';
  }

  const death = person.events.find(({ type }) => type === 'Death');
  let formattedDeath;
  if (death) {
    formattedDeath = formatEvent(death);
  } else {
    formattedDeath = '**Unknown**';
  }

  const father = person.childOf[0]?.father;
  let formattedFatherName = '**Unknown**';
  if (father) {
    formattedFatherName = formatName(findPreferredName(father));
  }

  const mother = person.childOf[0]?.mother;
  let formattedMotherName = '**Unknown**';
  if (mother) {
    formattedMotherName = formatName(findPreferredName(mother));
  }

  return (`# ${formattedName}

## Life Events  

  * 🎂 Birth: ${formattedBirth}
  * 🪦 Death: ${formattedDeath}

## Parents

  * 👨 Father: **${formattedFatherName}**
  * 👩 Mother: **${formattedMotherName}**

## Families

 `);
}
