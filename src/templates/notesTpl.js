export default (notes) => {
  let formattedNotes = '';

  if (notes.length > 0) {
    formattedNotes += '## Notes';
    notes.forEach(({ text }) => {
      formattedNotes += `\n\n${text}`;
    });
    formattedNotes += '\n\n';
  }

  return formattedNotes;
};
