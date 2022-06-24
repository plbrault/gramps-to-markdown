function findPreferredName(person) {
  return person.names.find(({ preferred }) => preferred);
}

export default findPreferredName;
