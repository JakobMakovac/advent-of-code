const FileReader = require('../common/file-reader');
const { Field, Pair } = require('./field');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);
const field = new Field();
const limit = 4000000;
const multiplier = 4000000;

for (const pairData of data) {
    const pair = new Pair(pairData, limit);
    field.addPair(pair);
}

for (const pair of field.pairs) {
    for (const point of pair.outerPerimeter) {
        if (!field.isOverlapping(point)) {
            console.log((point[0] * multiplier) + point[1]);
            return;
        }
    }
}
