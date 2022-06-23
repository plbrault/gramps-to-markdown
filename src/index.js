import fs from 'fs';
import gzip from 'node-gzip';
import { XMLParser } from 'fast-xml-parser';

const { ungzip } = gzip;

const [, , inputFile] = process.argv;

if (inputFile === undefined) {
  console.error('Input argument missing.');
}

const xmlParser = new XMLParser();

(async () => {
  const compressedXmlData = fs.readFileSync(inputFile);
  const xmlDataBuffer = await ungzip(compressedXmlData);
  const xmlData = xmlDataBuffer.toString();
  const obj = xmlParser.parse(xmlData);

  console.log(obj);
})();
