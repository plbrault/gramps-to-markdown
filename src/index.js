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

database.getPeople().forEach((person) => {
  console.log(personTpl(person));
});

//fs.writeFile('testData/test.md', test, 'utf8', () => {});
