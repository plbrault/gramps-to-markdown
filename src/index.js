import readXmlFromFile from './readXmlFromFile.js';
import Database from './Database.js';

const [, , inputFile] = process.argv;

if (inputFile === undefined) {
  console.error('Input argument missing.');
}

const xmlData = await readXmlFromFile(inputFile);
const database = new Database(xmlData);
