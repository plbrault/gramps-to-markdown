import { XMLParser } from 'fast-xml-parser';

/* eslint-disable no-param-reassign */

function parseXml(xmlData) {
  const isAlwaysArray = [
    'database.people.person.name',
    'database.people.person.name.surname',
    'database.people.person.name.citationref',
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

function createObjects(rawData, { includePrivateData }) {
  const objects = {};

  Object.keys(rawData.database)
    .filter((key) => ['events', 'people', 'families', 'citations', 'sources', 'places', 'notes'].includes(key))
    .forEach((key) => {
      const objType = Object.keys(rawData.database[key])[0];
      rawData.database[key][objType]
        .filter((obj) => !obj.priv || includePrivateData)
        .forEach((obj) => {
          objects[obj.handle] = {
            handle: obj.handle, type: objType, raw: obj, data: { },
          };
        });
    });

  return objects;
}

function createName(objects, nameRawData) {
  const name = {
    type: nameRawData.type,
    parts: [],
    preferred: !nameRawData.alt,
    citations: [],
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
        namePart.prefix = surname.prefix;
      }
      if (surname.prim) {
        namePart.prim = surname.prim;
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
  if (nameRawData.citationref) {
    nameRawData.citationref.forEach(({ hlink }) => {
      if (objects[hlink] && objects[objects[hlink].raw.sourceref.hlink]) {
        name.citations.push(objects[hlink].data);
      }
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
          person.data.names.push(createName(objects, name));
        });
      }
      if (person.raw.eventref) {
        person.raw.eventref.forEach(({ hlink }) => {
          if (objects[hlink]) {
            person.data.events.push(objects[hlink].data);
          }
        });
      }
      if (person.raw.citationref) {
        person.raw.citationref.forEach(({ hlink }) => {
          if (objects[hlink] && objects[objects[hlink].raw.sourceref.hlink]) {
            person.data.citations.push(objects[hlink].data);
          }
        });
      }
      if (person.raw.childof) {
        person.raw.childof.forEach(({ hlink }) => {
          if (objects[hlink]) {
            person.data.childOf.push(objects[hlink].data);
          }
        });
      }
      if (person.raw.parentin) {
        person.raw.parentin.forEach(({ hlink }) => {
          if (objects[hlink]) {
            person.data.parentIn.push(objects[hlink].data);
          }
        });
      }
      if (person.raw.noteref) {
        person.raw.noteref.forEach(({ hlink }) => {
          if (objects[hlink]) {
            person.data.notes.push(objects[hlink].data);
          }
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
        event.data.dateVal = event.raw.dateval;
      }
      if (event.raw.place) {
        if (objects[event.raw.place.hlink]) {
          event.data.place = objects[event.raw.place.hlink].data;
        }
      }
      if (event.raw.description) {
        event.data.description = event.raw.description['#text'];
      }
      if (event.raw.citationref) {
        event.raw.citationref.forEach(({ hlink }) => {
          if (objects[hlink] && objects[objects[hlink].raw.sourceref.hlink]) {
            event.data.citations.push(objects[hlink].data);
          }
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

function createCitations(objects) {
  const citations = [];

  Object.values(objects)
    .filter(({ type }) => type === 'citation')
    .forEach((citation) => {
      Object.assign(citation.data, {
        id: citation.raw.id,
        change: citation.raw.change,
      });

      if (objects[citation.raw.sourceref.hlink]) {
        citation.data.source = objects[citation.raw.sourceref.hlink].data;
      }

      if (citation.raw.page) {
        citation.data.page = citation.raw.page['#text'];
      }

      citations.push(citation.data);
    });

  return citations;
}

function createSources(objects) {
  const sources = [];

  Object.values(objects)
    .filter(({ type }) => type === 'source')
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

function createFamilies(objects) {
  const families = [];

  Object.values(objects)
    .filter(({ type }) => type === 'family')
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
        if (objects[family.raw.father.hlink]) {
          family.data.father = objects[family.raw.father.hlink].data;
        }
      }
      if (family.raw.mother) {
        if (objects[family.raw.mother.hlink]) {
          family.data.mother = objects[family.raw.mother.hlink].data;
        }
      }
      if (family.raw.eventref) {
        family.raw.eventref.forEach(({ hlink }) => {
          if (objects[hlink]) {
            family.data.events.push(objects[hlink].data);
          }
        });
      }
      if (family.raw.noteref) {
        family.raw.noteref.forEach(({ hlink }) => {
          if (objects[hlink]) {
            family.data.notes.push(objects[hlink].data);
          }
        });
      }
      if (family.raw.childref) {
        family.raw.childref.forEach(({ hlink }) => {
          if (objects[hlink]) {
            family.data.children.push(objects[hlink].data);
          }
        });
      }
      if (family.raw.citationref) {
        family.raw.citationref.forEach(({ hlink }) => {
          if (objects[hlink] && objects[objects[hlink].raw.sourceref.hlink]) {
            family.data.citations.push(objects[hlink].data);
          }
        });
      }

      families.push(family.data);
    });

  return families;
}

function createNotes(objects) {
  const notes = [];

  Object.values(objects)
    .filter(({ type }) => type === 'note')
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
  const objects = createObjects(rawData, { includePrivateData });

  const people = createPeople(objects, { includePrivateData });
  const events = createEvents(objects);
  const places = createPlaces(objects);
  const citations = createCitations(objects);
  const sources = createSources(objects);
  const families = createFamilies(objects);
  const notes = createNotes(objects);

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
