function formatNotes(obj) {
  let formattedNotes = '';

  if (obj.notes.length > 0) {
    formattedNotes += '## Notes';
    obj.notes.forEach(({ text }) => {
      formattedNotes += `\n\n${text}`;
    });
    formattedNotes += '\n\n';
  }

  return formattedNotes;
}

export default formatNotes;
