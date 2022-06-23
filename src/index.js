import gzip from 'node-gzip';

const { ungzip } = gzip;

const [, , inputFile] = process.argv;

if (inputFile === undefined) {
  console.error('Input argument missing.');
}
