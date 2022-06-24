function findPreferredName(person) {
  if (person) {
    return person.names.find(({ preferred }) => preferred);
  }
  return undefined;
}

export default findPreferredName;
