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
    'database.families.family.eventref',
    'database.families.family.noteref',
    'database.families.family.childref',
    'database.families.family.citationref',
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

function createPeople(objects, { includePrivateData }) {
  const people = [];

  Object.values(objects)
    .filter(({ type, data: { isPrivate } }) => type === 'person' && (!isPrivate || includePrivateData))
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
        person.raw.parentin.forEach(({ hlink }) => {
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

function createEvents(objects, { includePrivateData }) {
  const events = [];

  Object.values(objects)
    .filter(({ type, data: { isPrivate } }) => type === 'event' && (!isPrivate || includePrivateData))
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

function createPlaces(objects, { includePrivateData }) {
  const places = [];

  Object.values(objects)
    .filter(({ type, data: { isPrivate } }) => type === 'placeobj' && (!isPrivate || includePrivateData))
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

function createCitations(objects, { includePrivateData }) {
  const citations = [];

  Object.values(objects)
    .filter(({ type, data: { isPrivate } }) => type === 'citation' && (!isPrivate || includePrivateData))
    .forEach((citation) => {
      Object.assign(citation.data, {
        id: citation.raw.id,
        change: citation.raw.change,
        source: objects[citation.raw.sourceref.hlink].data,
      });

      if (citation.raw.page) {
        citation.data.page = citation.raw.page['#text'];
      }

      citations.push(citation.data);
    });

  return citations;
}

function createSources(objects, { includePrivateData }) {
  const sources = [];

  Object.values(objects)
    .filter(({ type, data: { isPrivate } }) => type === 'source' && (!isPrivate || includePrivateData))
    .forEach((source) => {
      Object.assign(source.data, {
        id: source.raw.id,
        change: source.raw.change,
      });

      if (source.raw.stitle) {
        source.data.title = source.raw.stitle['#text'];
      }
      if (source.raw.sauthor) {
        source.data.author = source.raw.sauthor['#text'];
      }
      if (source.raw.spubinfo) {
        source.data.pubInfo = source.raw.spubinfo['#text'];
      }

      sources.push(source.data);
    });

  return sources;
}

function createFamilies(objects, { includePrivateData }) {
  const families = [];

  Object.values(objects)
    .filter(({ type, data: { isPrivate } }) => type === 'family' && (!isPrivate || includePrivateData))
    .forEach((family) => {
      Object.assign(family.data, {
        id: family.raw.id,
        change: family.raw.change,
        events: [],
        children: [],
        notes: [],
        citations: [],
      });

      if (family.raw.rel) {
        family.data.relationType = family.raw.rel.type;
      }
      if (family.raw.father) {
        family.data.father = objects[family.raw.father.hlink].data;
      }
      if (family.raw.mother) {
        family.data.mother = objects[family.raw.mother.hlink].data;
      }
      if (family.raw.eventref) {
        family.raw.eventref.forEach(({ hlink }) => {
          family.data.events.push(objects[hlink].data);
        });
      }
      if (family.raw.noteref) {
        family.raw.noteref.forEach(({ hlink }) => {
          family.data.notes.push(objects[hlink].data);
        });
      }
      if (family.raw.childref) {
        family.raw.childref.forEach(({ hlink }) => {
          family.data.children.push(objects[hlink].data);
        });
      }
      if (family.raw.citationref) {
        family.raw.citationref.forEach(({ hlink }) => {
          family.data.citations.push(objects[hlink].data);
        });
      }

      families.push(family.data);
    });

  return families;
}

function createNotes(objects, { includePrivateData }) {
  const notes = [];

  Object.values(objects)
    .filter(({ type, data: { isPrivate } }) => type === 'note' && (!isPrivate || includePrivateData))
    .forEach((note) => {
      Object.assign(note.data, {
        id: note.raw.id,
        change: note.raw.change,
        type: note.raw.type,
        text: note.raw.text['#text'],
      });

      notes.push(note.data);
    });

  return notes;
}

/* eslint-enable no-param-reassign */

function prepareData(xmlData, { includePrivateData }) {
  const rawData = parseXml(xmlData);
  const objects = createObjects(rawData);

  const people = createPeople(objects, { includePrivateData });
  const events = createEvents(objects, { includePrivateData });
  const places = createPlaces(objects, { includePrivateData });
  const citations = createCitations(objects, { includePrivateData });
  const sources = createSources(objects, { includePrivateData });
  const families = createFamilies(objects, { includePrivateData });
  const notes = createNotes(objects, { includePrivateData });

  const data = {
    people,
    events,
    places,
    citations,
    sources,
    families,
    notes,
    peopleByID: people.reduce((peopleByID, person) => ({ ...peopleByID, [person.id]: person }), {}),
  };
  return data;
}

class Database {
  #data;

  constructor(xmlData, { includePrivateData = false } = {}) {
    this.#data = prepareData(xmlData, { includePrivateData });
  }

  getPeople() {
    return this.#data.people;
  }

  getPerson(id) {
    return this.#data.peopleByID[id];
  }
}

export default Database;
