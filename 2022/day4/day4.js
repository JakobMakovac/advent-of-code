const FileReader = require('../common/file-reader');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);

var completeOverlap = 0;
var partialOverlap = 0;

data.forEach(line => {
    var range1Start, range1End, range2Start, range2End;
    const ranges = line.split(',').map((range) => range.split('-').map((char) => parseInt(char)));
    
    [range1Start, range1End] = ranges[0];
    [range2Start, range2End] = ranges[1];

    if ((range1Start >= range2Start && range1Start <= range2End) ||
        (range1End <= range2End && range1End >= range2Start) ||
        (range2Start >= range1Start && range2Start <= range1End) ||
        (range2End <= range1End && range2End >= range1Start)) {
            partialOverlap ++;
        }

    if ((range1Start >= range2Start && range1Start <= range2End && range1End <= range2End && range1End >= range2Start) ||
        (range2Start >= range1Start && range2Start <= range1End && range2End <= range1End && range2End >= range1Start)) {
            completeOverlap ++;
        }
});

console.log(`Completely overlapping ranges: ${completeOverlap}`);
console.log(`Partially overlapping ranges: ${partialOverlap}`);