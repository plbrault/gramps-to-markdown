import readXmlFromFile from './functions/readXmlFromFile.js';
import parseXml from './functions/parseXml.js';

const [, , inputFile] = process.argv;

if (inputFile === undefined) {
  console.error('Input argument missing.');
}

(async () => {
  const xmlData = await readXmlFromFile(inputFile);
  const obj = parseXml(xmlData);

  console.log(obj);
})();
