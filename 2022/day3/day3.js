const FileReader = require('../common/file-reader');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);

const groupLength = 3;

var totalSum = 0;
var groupCounter = 1;
var lines = [];

data.forEach(line => {
    if (groupCounter < groupLength) {
        lines.push(line);
        groupCounter++;
    } else {
        lines.push(line);
        const duplicatedChar = findDuplicateChar(lines);
        totalSum += mapToPriority(duplicatedChar);
        groupCounter = 1;
        lines = [];
    }
});

function findDuplicateChar(lines) {
    const commonChars = {};

    lines.forEach(line => {
        if (Object.keys(commonChars).length === 0) {
            for (var i = 0; i < line.length; i++) {
                commonChars[line[i]] = 1;
            }
        } else {
            const newChars = {}
            for (var i = 0; i < line.length; i++) {
                newChars[line[i]] = 1;
            }
            Object.keys(commonChars).forEach(key => {
                if (!newChars[key]) {
                    delete commonChars[key];
                }
            })
        }
    })

    return Object.keys(commonChars)[0];
}

function mapToPriority(char) {
    // To get lowercase letters to index 1...26
    const charCode = char.charCodeAt(0) - 96;

    if (charCode < 0) {
        // Move uppercase letters above lowercase 27...52
        return charCode + 58;
    }

    return charCode;
}

console.log(`Sum of priorities: ${totalSum}`);