import { XMLParser } from 'fast-xml-parser';

const xmlParser = new XMLParser();

function parseXml(xml) {
  return xmlParser.parse(xml);
}

export default parseXml;
