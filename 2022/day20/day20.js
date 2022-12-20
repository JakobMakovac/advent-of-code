const FileReader = require('../common/file-reader');
const { LinkedList } = require('./list');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);
const list = new LinkedList();

for (const line of data) {
    list.addNode(parseInt(line));
}
list.circularize();

for (var i = 0; i <= list.listIndex; i++) {
    const currNode = list.findNodeAtOriginalIndex(i);
    list.moveNode(currNode, Math.abs(currNode.value), currNode.value > 0);
}

