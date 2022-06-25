import fs from 'fs';
import readXmlFromFile from './data/readXmlFromFile.js';
import Database from './data/Database.js';
import getCreateLink from './getCreateLink.js';
import getTranslate from './getTranslate.js';

import personTpl from './templates/personTpl.js';
import peopleTpl from './templates/peopleTpl.js';

const [, , inputFile, outputDir = './output', optionsJSON = '{}'] = process.argv;

function printUsage() {
  console.log('');
  console.log('Usage:');
  console.log('    gramps2md inputFilePath [outputDirPath] [options]');
  console.log('');
  console.log('Examples:');
  console.log('    gramps2md genealogy.gramps');
  console.log('    gramps2md genealogy.gramps output');
  console.log('    gramps2md genealogy.gramps output \'{ "urlPrefix": "/genealogy", "urlExt": ".html", "languages": ["en", "fr"] }\'');
}

if (inputFile === undefined) {
  console.error('You must provide an input file.');
  printUsage();
  process.exit(1);
}

const options = {
  languages: ['en'],
  urlPrefix: '',
  urlExt: '.md',
  ...JSON.parse(optionsJSON),
};

console.log('Options used: ', options);

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
      createLink: createLinkFunctions[0], t: translateFunctions[0],
    });
    const filename = `${outputDir}/${person.id}.md`;
    fs.writeFileSync(filename, markdown, 'utf8');
    console.log(`Created file ${filename}`);
  } else {
    translateFunctions.forEach((t, id) => {
      const markdown = personTpl(person, { createLink: createLinkFunctions[id], t });
      const filename = `${outputDir}/${person.id}-${options.languages[id]}.md`;
      fs.writeFileSync(filename, markdown, 'utf8');
      console.log(`Created file ${filename}`);
    });
  }
});

if (options.languages.length === 1) {
  const markdown = peopleTpl(database.getPeople(), {
    createLink: createLinkFunctions[0], t: translateFunctions[0],
  });
  const filename = `${outputDir}/individuals.md`;
  fs.writeFileSync(filename, markdown, 'utf8');
  console.log(`Created file ${filename}`);
} else {
  translateFunctions.forEach((t, id) => {
    const markdown = peopleTpl(database.getPeople(), { createLink: createLinkFunctions[id], t });
    const filename = `${outputDir}/individuals-${options.languages[id]}.md`;
    fs.writeFileSync(filename, markdown, 'utf8');
    console.log(`Created file ${filename}`);
  });
}
