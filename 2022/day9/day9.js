const FileReader = require('../common/file-reader');
const { Rope } = require('./rope');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);

const rope = new Rope(10);
visitedPositions = {};

for (var i = 0; i < data.length; i++) {
    var direction, steps;
    [direction, steps] = data[i].split(' ');
    steps = parseInt(steps);
    
    for (var j = 0; j < steps; j++) {
        rope.moveHead(direction);
        markVisitedPosition(rope.getTailPosition());
    }
}

var visitedPositionsCount = 0;

Object.values(visitedPositions).map((b) => {
    Object.values(b).map((a) => {
        visitedPositionsCount ++;
    })
})

console.log(visitedPositionsCount);

function markVisitedPosition(tailPos) {
    if (!visitedPositions[tailPos.x]) {
        visitedPositions[tailPos.x] = {}
    }

    if (!visitedPositions[tailPos.x][tailPos.y]) {
        visitedPositions[tailPos.x][tailPos.y] = 1;
    }
}