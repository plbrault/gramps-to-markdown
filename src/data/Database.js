import { XMLParser } from 'fast-xml-parser';

/* eslint-disable no-param-reassign */

function parseXml(xmlData) {
  const isAlwaysArray = [
    'database.people.person.name',
    'database.people.person.name.surname',
    'database.people.person.eventref',
    'database.people.person.citationref',
    'database.people.person.parentin',
    'database.people.person.childof',
    'database.people.person.noteref',
    'database.events.event.citationref',
    'database.places.placeobj.pname',
    'database.places.placeobj.placeref',
  ];
  const xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    alwaysCreateTextNode: true,
    isArray: (name, jpath) => isAlwaysArray.includes(jpath),
  });

  return xmlParser.parse(xmlData);
}

function createObjects(rawData) {
  const objects = {};

  Object.keys(rawData.database)
    .filter((key) => ['events', 'people', 'families', 'citations', 'sources', 'places', 'notes'].includes(key))
    .forEach((key) => {
      const objType = Object.keys(rawData.database[key])[0];
      rawData.database[key][objType]
        .forEach((obj) => {
          objects[obj.handle] = {
            handle: obj.handle, type: objType, raw: obj, data: { isPrivate: !!obj.priv },
          };
        });
    });

  return objects;
}

function createName(nameRawData) {
  const name = {
    type: nameRawData.type,
    parts: [],
    preferred: !nameRawData.alt,
  };
  if (nameRawData.first) {
    name.parts.push({ partType: 'first', value: nameRawData.first['#text'] });
  }
  if (nameRawData.call) {
    name.parts.push({ partType: 'call', value: nameRawData.call['#text'] });
  }
  if (nameRawData.suffix) {
    name.parts.push({ partType: 'suffix', value: nameRawData.suffix['#text'] });
  }
  if (nameRawData.title) {
    name.parts.push({ partType: 'title', value: nameRawData.title['#text'] });
  }
  if (nameRawData.nick) {
    name.parts.push({ partType: 'nick', value: nameRawData.nick['#text'] });
  }
  if (nameRawData.familynick) {
    name.parts.push({ partType: 'familynick', value: nameRawData.familynick['#text'] });
  }
  if (nameRawData.group) {
    name.parts.push({ partType: 'group', value: nameRawData.group['#text'] });
  }
  if (nameRawData.surname) {
    nameRawData.surname.forEach((surname) => {
      const namePart = { partType: 'surname', value: surname['#text'] };
      if (surname.prefix) {
        namePart.derivation = surname.prefix;
      }
      if (surname.prim) {
        namePart.derivation = surname.prim;
      }
      if (surname.derivation) {
        namePart.derivation = surname.derivation;
      }
      if (surname.connector) {
        namePart.connector = surname.connector;
      }
      name.parts.push(namePart);
    });
  }
  return name;
}

function createPeople(objects) {
  const people = [];

  Object.values(objects)
    .filter(({ type }) => type === 'person')
    .forEach((person) => {
      Object.assign(person.data, {
        id: person.raw.id,
        change: person.raw.change,
        gender: person.raw.gender['#text'],
        names: [],
        events: [],
        citations: [],
        parentIn: [],
        childOf: [],
        notes: [],
      });

      if (person.raw.name) {
        person.raw.name.forEach((name) => {
          person.data.names.push(createName(name));
        });
      }
      if (person.raw.eventref) {
        person.raw.eventref.forEach(({ hlink }) => {
          person.data.events.push(objects[hlink].data);
        });
      }
      if (person.raw.citationref) {
        person.raw.citationref.forEach(({ hlink }) => {
          person.data.citations.push(objects[hlink].data);
        });
      }
      if (person.raw.childof) {
        person.raw.childof.forEach(({ hlink }) => {
          person.data.childOf.push(objects[hlink].data);
        });
      }
      if (person.raw.parentin) {
        person.raw.parentin.forEach(({ hlink }) => {
          person.data.parentIn.push(objects[hlink].data);
        });
      }
      if (person.raw.noteref) {
        person.raw.noteref.forEach(({ hlink }) => {
          person.data.notes.push(objects[hlink].data);
        });
      }

      people.push(person.data);
    });

  return people;
}

function createEvents(objects) {
  const events = [];

  Object.values(objects)
    .filter(({ type }) => type === 'event')
    .forEach((event) => {
      Object.assign(event.data, {
        id: event.raw.id,
        change: event.raw.change,
        type: event.raw.type['#text'],
        citations: [],
      });

      if (event.raw.dateval) {
        event.data.dateval = event.raw.dateval;
      }
      if (event.raw.place) {
        event.data.place = objects[event.raw.place.hlink].data;
      }
      if (event.raw.description) {
        event.data.description = event.raw.description['#text'];
      }
      if (event.raw.citationref) {
        event.raw.citationref.forEach(({ hlink }) => {
          event.data.citations.push(objects[hlink].data);
        });
      }

      events.push(event.data);
    });

  return events;
}

function createPlaces(objects) {
  const places = [];

  Object.values(objects)
    .filter(({ type }) => type === 'placeobj')
    .forEach((place) => {
      Object.assign(place.data, {
        id: place.raw.id,
        change: place.raw.change,
        type: place.raw.type,
        names: [],
        partOf: [],
      });

      if (place.raw.ptitle) {
        place.data.title = place.raw.ptitle['#text'];
      }
      place.raw.pname.forEach((pname) => {
        const placeName = {};
        if (pname.value) {
          placeName.value = pname.value;
        }
        if (pname.lang) {
          placeName.lang = pname.lang;
        }
        place.data.names.push(placeName);
      });
      if (place.raw.placeref) {
        place.raw.placeref.forEach(({ hlink }) => {
          place.data.partOf.push(objects[hlink].data);
        });
      }

      places.push(place.data);
    });

  return places;
}

/* eslint-enable no-param-reassign */

function prepareData(xmlData) {
  const rawData = parseXml(xmlData);
  const objects = createObjects(rawData);

  const people = createPeople(objects);
  const events = createEvents(objects);
  const places = createPlaces(objects);

  console.log(places[0]);

  const data = rawData;
  return data;
}

class Database {
  #data;

  constructor(xmlData) {
    this.#data = prepareData(xmlData);

    // console.log(this.#data.database.people);
  }
}

export default Database;
