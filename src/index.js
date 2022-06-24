import fs from 'fs';
import readXmlFromFile from './data/readXmlFromFile.js';
import Database from './data/Database.js';
import getCreateLink from './getCreateLink.js';

import personTpl from './templates/personTpl.js';

const [, , inputFile, outputDir = './output', optionsJSON = '{}'] = process.argv;

const options = {
  urlPrefix: '',
  urlExt: '.md',
  ...JSON.parse(optionsJSON),
};

if (inputFile === undefined) {
  console.error('Input argument missing.');
}

const xmlData = await readXmlFromFile(inputFile);
const database = new Database(xmlData);

const createLink = getCreateLink(options);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

database.getPeople().forEach((person) => {
  const markdown = personTpl(person, { createLink });
  fs.writeFileSync(`${outputDir}/${person.id}.md`, markdown, 'utf8');
});
