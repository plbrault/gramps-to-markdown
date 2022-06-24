import fs from 'fs';
import readXmlFromFile from './data/readXmlFromFile.js';
import Database from './data/Database.js';
import getCreateLink from './getCreateLink.js';
import getTranslate from './getTranslate.js';

import personTpl from './templates/personTpl.js';
import peopleTpl from './templates/peopleTpl.js';

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

const translateFunctions = options.languages.map((language) => getTranslate({ locale: language }));
const createLinkFunctions = options.languages.map((language) => getCreateLink(language, options));

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

database.getPeople().forEach((person) => {
  if (options.languages.length === 1) {
    const markdown = personTpl(person, {
      createLink: createLinkFunctions[0], t: translateFunctions[0]
    });
    fs.writeFileSync(`${outputDir}/${person.id}.md`, markdown, 'utf8');
  } else {
    translateFunctions.forEach((t, id) => {
      const markdown = personTpl(person, { createLink: createLinkFunctions[id], t });
      fs.writeFileSync(`${outputDir}/${person.id}-${options.languages[id]}.md`, markdown, 'utf8');
    });
  }
});

if (options.languages.length === 1) {
  const markdown = peopleTpl(database.getPeople(), {
    createLink: createLinkFunctions[0], t: translateFunctions[0],
  });
  fs.writeFileSync(`${outputDir}/individuals.md`, markdown, 'utf8');
} else {
  translateFunctions.forEach((t, id) => {
    const markdown = peopleTpl(database.getPeople(), { createLink: createLinkFunctions[id], t });
    fs.writeFileSync(`${outputDir}/individuals-${options.languages[id]}.md`, markdown, 'utf8');
  });
}
