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

class Database {
  #data;

  constructor(xmlData) {
    this.#prepareDatabase(xmlData);

    //console.log(this.#data.database.people);
  }

  #prepareDatabase(xmlData) {
    const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const rawData = xmlParser.parse(xmlData);

    const objects = createObjects(rawData);

    console.log(objects);
  
    this.#data = rawData;
  }
}

export default Database;
