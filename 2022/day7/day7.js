const FileReader = require('../common/file-reader');
const { Tree } = require('./tree');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);

const tree = new Tree();
var outputLines = [];

data.forEach(line => {
    if (line.startsWith('$')) {
        if (outputLines.length > 0) {
            parseOutput(outputLines);
        }
        parseCommand(line);
        outputLines = [];
    } else {
        outputLines.push(line);
    }
});

if (outputLines.length >  0) {
    parseOutput(outputLines);
}

console.log(`Sum of directories under 100000: ${tree.sumDirs()}`);
console.log(`Size of smallest directory to delete for update: ${tree.findSmallestToDelete()}`);

function parseCommand(command) {
    const cmdParts = command.split(' ');
    const cmd = cmdParts[1];
    const args = cmdParts.slice(2);

    switch(cmd) {
        case 'cd':
            if (args[0] === '..') {
                tree.moveUp();
            } else {
                tree.moveIntoDir(args[0]);
            }
        case 'ls':
            break;
    }
}

function parseOutput(lines) {
    var files = [];
    var dirs = [];
    
    lines.forEach((line) => {
        if (line.startsWith('dir')) {
            dirs.push(line.split(' ')[1]);
        } else {
            [fileSize, fileName] = line.split(' ');
            files.push({name: fileName, size: fileSize})
        }
    });

    tree.addDirs(dirs);
    tree.addFiles(files);
}