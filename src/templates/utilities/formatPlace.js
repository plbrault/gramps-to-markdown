function formatPlace(place) {
  let name = '';

  name += place.names[0].value;
  if (place.partOf[0]) {
    name += `, ${formatPlace(place.partOf[0])}`;
  }

  return name;
}

export default formatPlace;
