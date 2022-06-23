import { XMLParser } from 'fast-xml-parser';

function createObjects(rawData) {
  const objects = {};

  Object.keys(rawData.database)
    .filter(key => ['events', 'people', 'families', 'citations', 'sources', 'places', 'notes'].includes(key))
    .forEach(key => {
      const objType = Object.keys(rawData.database[key])[0];
      rawData.database[key][objType].forEach(obj => {
        objects[obj.handle] = { handle: obj.handle, type: objType, raw: obj, data: {} };
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
  if (nameRawData.surname) {
    const namePart = { partType: 'surname', value: nameRawData.surname['#text'] };
    if (nameRawData.surname.derivation) {
      namePart.derivation = nameRawData.surname.derivation;
    }
    name.parts.push(namePart);
  }
  return name;
}

function createPeople(objects) {
  const people = [];

  Object.values(objects)
    .filter(({ type }) => type === 'person')
    .forEach(person => {
      //console.log(person);

      person.data = {
        id: person.raw.id,
        change: person.raw.change,
        gender: person.gender,
        names: [],
        events: [],
        citations: [],
        parentIn: [],
        notes: [],
      };

      if (Array.isArray(person.raw.name)) {
        person.raw.name.forEach(name => {
          createName(name);
        });
      } else {

      }

      people.push(person.data);
    });

  return people;
}

class Database {
  #data;

  constructor(xmlData) {
    this.#prepareDatabase(xmlData);

    //console.log(this.#data.database.people);
  }

  #prepareDatabase(xmlData) {
    const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', alwaysCreateTextNode: true });
    const rawData = xmlParser.parse(xmlData);

    const objects = createObjects(rawData);

    //console.log(objects);

    const people = createPeople(objects);
  
    this.#data = rawData;
  }
}

export default Database;
