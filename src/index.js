import readXmlFromFile from './functions/readXmlFromFile.js';
import Database from './classes/Database.js';

const [, , inputFile] = process.argv;

if (inputFile === undefined) {
  console.error('Input argument missing.');
}

(async () => {
  const xmlData = await readXmlFromFile(inputFile);
  const database = new Database(xmlData);

  
})();
