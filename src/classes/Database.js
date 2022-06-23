import { XMLParser } from 'fast-xml-parser';

class Database {
  #data;

  constructor(xmlData) {
    this.#prepareDatabase(xmlData);

    console.log(this.#data);
  }
  
  #prepareDatabase(xmlData) {
    const xmlParser = new XMLParser();
    const rawData = xmlParser.parse(xmlData);

    this.#data = rawData;
  }
}

export default Database;
