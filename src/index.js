import fs from 'fs';
import readXmlFromFile from './data/readXmlFromFile.js';
import Database from './data/Database.js';
import personTpl from './templates/personTpl.js';

const [, , inputFile] = process.argv;

if (inputFile === undefined) {
  console.error('Input argument missing.');
}

const xmlData = await readXmlFromFile(inputFile);
const database = new Database(xmlData);

console.log('------');
console.log(personTpl(database.getPerson('I0018')));
console.log('------');
console.log(personTpl(database.getPerson('I0126')));
console.log('------');
console.log(personTpl(database.getPerson('I0354')));

const test = personTpl(database.getPerson('I0354'));

fs.writeFile('testData/test.md', test, 'utf8', () => {});
