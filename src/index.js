import fs from 'fs';
import readXmlFromFile from './data/readXmlFromFile.js';
import Database from './data/Database.js';
import getCreateLink from './getCreateLink.js';
import getTranslate from './getTranslate.js';

import personTpl from './templates/personTpl.js';

const [, , inputFile, outputDir = './output', optionsJSON = '{}'] = process.argv;

if (inputFile === undefined) {
  console.error('Input argument missing.');
}

const options = {
  languages: ['en'],
  urlPrefix: '',
  urlExt: '.md',
  ...JSON.parse(optionsJSON),
};

const xmlData = await readXmlFromFile(inputFile);
const database = new Database(xmlData);

const createLink = getCreateLink(options);
const translate = getTranslate({ locale: options.languages[0] });

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

database.getPeople().forEach((person) => {
  const markdown = personTpl(person, { createLink, t: translate });
  fs.writeFileSync(`${outputDir}/${person.id}.md`, markdown, 'utf8');
});
