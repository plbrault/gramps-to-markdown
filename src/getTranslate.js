import fr from './locales/fr.js';

function getTranslate({ locale }) {
  let dict;
  if (locale === 'fr') {
    dict = fr;
  }
  if (dict) {
    return (str) => dict[str] || str;
  }
  return (str) => str;
}

export default getTranslate;
