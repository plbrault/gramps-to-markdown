export default (notes, { titleMarkdown = '##' } = {}) => {
  let formattedNotes = '';

  if (notes.length > 0) {
    formattedNotes += `\n${titleMarkdown} Notes`;
    notes.forEach(({ text }) => {
      formattedNotes += `\n\n${text}`;
    });
    formattedNotes += '\n';
  }

  return formattedNotes;
};
