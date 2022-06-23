import fs from 'fs';
import gzip from 'node-gzip';

const { ungzip } = gzip;

async function readXmlFromFile(filename) {
  const compressedXmlData = fs.readFileSync(filename);
  const xmlDataBuffer = await ungzip(compressedXmlData);
  const xmlData = xmlDataBuffer.toString();

  return xmlData;
}

export default readXmlFromFile;
