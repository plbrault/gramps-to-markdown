import readXmlFromFile from './data/readXmlFromFile.js';
import Database from './data/Database.js';
import personTemplate from './templates/person.js';

const [, , inputFile] = process.argv;

if (inputFile === undefined) {
  console.error('Input argument missing.');
}

const xmlData = await readXmlFromFile(inputFile);
const database = new Database(xmlData);

console.log('------');
console.log(personTemplate({ person: database.getPerson('I0126') }));
console.log('------')
console.log(personTemplate({ person: database.getPerson('I0354') }));
