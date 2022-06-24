function getCreateLink({ urlPrefix, urlExt }) {
  return (linkedObject, content) => {
    if (linkedObject) {
      return `[${content}](${urlPrefix}${linkedObject.id}${urlExt})`;
    }
    return content;
  };
}

export default getCreateLink;
