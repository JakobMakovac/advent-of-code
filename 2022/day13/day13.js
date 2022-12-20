const FileReader = require('../common/file-reader');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);
var content = '';
var packets = [];

for (const line of data) {
    if (line === '') {
        continue;
    }
    packets.push(parsePacket(line));
}
packets.push([[2]]);
packets.push([[6]]);

packets.sort((a, b) => comparePackets(a, b, 0) ? -1 : 1);

packets.map((a, index) => content += `\n${index + 1}: ${a}`);

FileReader.writeFile(content);

function parsePacket(line) {
    return JSON.parse(line);
}

function comparePackets(left, right, index) {
    const leftValue = left[index];
    const rightValue = right[index];
    var arrayResult = undefined;

    if (leftValue === undefined && rightValue === undefined) {
        return undefined;
    }
    if (leftValue === undefined) {
        return true;
    } 
    if (rightValue === undefined) {
        return false;
    }

    if (Array.isArray(leftValue)) {
        arrayResult = Array.isArray(rightValue) 
            ? comparePackets(leftValue, rightValue, 0)
            : comparePackets(leftValue, [rightValue], 0);
    } else if (Array.isArray(rightValue)) {
        arrayResult = Array.isArray(leftValue) 
            ? comparePackets(leftValue, rightValue, 0)
            : comparePackets([leftValue], rightValue, 0);
    }
    
    if (arrayResult !== undefined) {
        return arrayResult;
    }

    if (leftValue < rightValue) {
        return true;
    } else if (leftValue > rightValue) {
        return false;
    }


    return comparePackets(left, right, index + 1);
}
