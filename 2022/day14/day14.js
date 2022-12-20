const FileReader = require('../common/file-reader');
const { Cave } = require('./cave');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);
const cave = new Cave();

for (var i = 0; i < data.length; i++) {
    const line = data[i];
    cave.addWall(line);
}

cave.fillSand();

console.log(cave.grains);
