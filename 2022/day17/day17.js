const FileReader = require('../common/file-reader');
const { Chamber } = require('./chamber');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const rocks = 2022;
const moreRocks = 1000000000000;
const chamber = new Chamber(7);

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Characters);
chamber.addJetStreams(data[0]);
console.log(chamber.dropRocks(moreRocks));
