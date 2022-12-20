const FileReader = require('../common/file-reader');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Characters);
var startNode;

class SearchNode {
    constructor (x, y, value) {
        this.x = x;
        this.y = y;
        if (value === 'a') {
            this.isGoal = true;
            this.value = value.charCodeAt() - 97;
        } else if (value === 'E') {
            this.isStart = true;
            this.fromStart = 0;
            this.value = 'z'.charCodeAt() - 97;
        } else {
            this.value = value.charCodeAt() - 97;
        }
    }

    isReachable(currNode) {
        return this.value > currNode.value - 2;
    }
}

// Find start and end coordinates
for (var i = 0; i < data.length; i++) {
    const line = data[i];
    startIndex = line.indexOf('E');
    if (startIndex > -1) {
        startNode = new SearchNode(startIndex, i, 'E');
    }
}

aStar(startNode, (node) => node.value + node.fromStart);

function aStar(start, h) {
    var searchQueue = [start];

    gScore = Array.from(Array(data.length), () => new Array(data[0].length).fill(Infinity));
    gScore[start.y][start.x] = 0;

    fScore = Array.from(Array(data.length), () => new Array(data[0].length).fill(Infinity));
    fScore[start.y][start.x] = h(start);

    while (searchQueue.length > 0) {
        const currNode = searchQueue.shift();
        if (currNode.isGoal) {
            return reconstructPath(currNode);
        }
    
        // Up
        if (currNode.y > 0) {
            const newNode = new SearchNode(currNode.x, currNode.y - 1, data[currNode.y - 1][currNode.x]);
            addNodeToQueue(newNode, currNode, h, searchQueue);
        }
    
        // Down
        if (currNode.y < data.length - 1) {
            const newNode = new SearchNode(currNode.x, currNode.y + 1, data[currNode.y + 1][currNode.x]);
            addNodeToQueue(newNode, currNode, h, searchQueue);
        }
    
        // Right
        if (currNode.x < data[0].length - 1) {
            const newNode = new SearchNode(currNode.x + 1, currNode.y, data[currNode.y][currNode.x + 1]);
            addNodeToQueue(newNode, currNode, h, searchQueue);
        }
    
        // Left
        if (currNode.x > 0) {
            const newNode = new SearchNode(currNode.x - 1, currNode.y, data[currNode.y][currNode.x - 1]);
            addNodeToQueue(newNode, currNode, h, searchQueue);
        }
    
        searchQueue.sort((a, b) => {
            return fScore[a.y][a.x] - fScore[b.y][b.x];
        });
    }
}

function addNodeToQueue(newNode, currNode, h, searchQueue) {
    var newG = gScore[currNode.y][currNode.x] + 1;
    if (newNode.isReachable(currNode) && newG < gScore[newNode.y][newNode.x]) {
        newNode.cameFrom = currNode;
        newNode.fromStart = currNode.fromStart + 1;
        gScore[newNode.y][newNode.x] = newG;
        fScore[newNode.y][newNode.x] = h(newNode);
        if (!searchQueue.find((node) => node.x === newNode.x && node.y === newNode.y)) {
            searchQueue.push(newNode);
        }
    }
}

function reconstructPath(node) {
    var steps = 0;
    var currNode = node;
    while (!currNode.isStart) {
        steps ++;
        data[currNode.y][currNode.x] = '-';
        currNode = currNode.cameFrom;
    }

    console.log(steps);
}
