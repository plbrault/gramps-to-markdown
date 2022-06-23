import { XMLParser } from 'fast-xml-parser';

import readXmlFromFile from './functions/readXmlFromFile.js';

const [, , inputFile] = process.argv;

if (inputFile === undefined) {
  console.error('Input argument missing.');
}

const xmlParser = new XMLParser();

(async () => {
  const xmlData = await readXmlFromFile(inputFile);
  const obj = xmlParser.parse(xmlData);

  console.log(obj);
})();
