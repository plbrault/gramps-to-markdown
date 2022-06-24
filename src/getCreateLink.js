function getCreateLink(currentLanguage, { urlPrefix, urlExt, languages }) {
  let urlSuffix = '';
  if (languages.length > 1) {
    urlSuffix = `-${currentLanguage}`;
  }
  return (linkedObject, content) => {
    if (linkedObject) {
      return `[${content}](${urlPrefix}${linkedObject.id}${urlSuffix}${urlExt})`;
    }
    return content;
  };
}

export default getCreateLink;
