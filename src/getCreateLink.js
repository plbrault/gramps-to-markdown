function getCreateLink() {
  return (linkedObject, content) => {
    if (linkedObject) {
      return `[${content}](${linkedObject.id}.md)`;
    }
    return content;
  };
}

export default getCreateLink;
