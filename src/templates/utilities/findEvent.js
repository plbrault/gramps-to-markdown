function findEvent(obj, eventType) {
  return obj.events.find(({ type }) => type === eventType);
}

export default findEvent;
