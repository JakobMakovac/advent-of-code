const FileReader = require('../common/file-reader');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);

const sums = [];
var partialSum = 0;

for (const line of data) {
    if (line === '') {
        sums.push(partialSum);
        partialSum = 0;
    } else {
        partialSum += parseInt(line);
    }
}

sums.push(partialSum);
sums.sort((a, b) => b - a);

console.log(`Part 1: ${sums[0]}`);
console.log(`Part 2: ${sums[0] + sums[1] + sums[2]}`)