const fs = require('fs');
const pQueue = require('./PriorityQueue');

class Node {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = parseInt(value);
        this.fScore = 0;
    }

    getKey() {
        return `${this.x}_${this.y}`;
    }

    getValue() {
        return this.value;
    }

    isEqual(node) {
        return this.getKey() === node.getKey();
    }

    setFScore(f) {
        this.fScore = f;
    }
}

function heuristicValue(fromNode, goalNode) {
    return (goalNode.y - fromNode.y) + (goalNode.x - fromNode.x);
}

function getNeighbours(current, map) {
    let _x = current.x;
    let _y = current.y;
    let out = [];

    if (_x > 0) {
        out.push(map[_y][_x - 1]);
    }
    if (_y > 0) {
        out.push(map[_y - 1][_x]);
    }
    if (_x < map[0].length - 1) {
        out.push(map[_y][_x + 1]);
    }
    if (_y < map[0].length - 1) {
        out.push(map[_y + 1][_x]);
    }

    return out;
}

function aStar(start, goal, nodeMap) {
    let keysInOpenSet = {};
    let cameFrom = {};
    let gScore = {};
    let openSet = new pQueue((a, b) => a.fScore < b.fScore);
    openSet.push(start);

    gScore[start.getKey()] = 0;
    start.fScore = heuristicValue(start, goal);

    while (!openSet.isEmpty()) {
        current = openSet.pop();
        delete keysInOpenSet[current.getKey()];

        if (current.isEqual(goal)) {
            return current.fScore;
        }

        for (const node of getNeighbours(current, nodeMap)) {
            _gScore = gScore[current.getKey()] + node.getValue();

            if (!gScore[node.getKey()] || _gScore < gScore[node.getKey()]) {
                cameFrom[node.getKey()] = current.getKey();
                gScore[node.getKey()] = _gScore;
                node.fScore = _gScore + heuristicValue(node, goal);
                if (!keysInOpenSet[node.getKey()]) {
                    keysInOpenSet[node.getKey()] = 1;
                    openSet.push(node);
                }
            }
        }
    }

    return -1;
}

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let lines = data.split('\r\n');

    var originalMap = lines.map((line, yIndex) => line.split('').map((char, xIndex) => new Node(xIndex, yIndex, char)));
    var extendedMap = new Array(originalMap.length * 5).fill(0).map(() => new Array(originalMap[0].length * 5));

    for (var y = 0; y < originalMap.length; y++) {
        for (var x = 0; x < originalMap[0].length; x++) {
            let value = originalMap[y][x].getValue();
            for (var i = 0; i < 5; i ++) {
                for (var j = 0; j < 5; j++) {
                    let newValue = value + i + j;
                    if (newValue > 9) {
                        newValue = newValue - 9;
                    }
                    let _x = x + (j * originalMap[0].length);
                    let _y = y + (i * originalMap.length);
                    extendedMap[_y][_x] = new Node(_x, _y, newValue);
                }
            }
        }
    }

    var totalRiskPart1 = aStar(originalMap[0][0], originalMap[originalMap.length - 1][originalMap[0].length - 1], originalMap);
    var totalRiskPart2 = aStar(extendedMap[0][0], extendedMap[extendedMap.length - 1][extendedMap[0].length - 1], extendedMap);

    console.log(`Solution for Part One: ${totalRiskPart1}`);
    console.log(`Solution for Part Two: ${totalRiskPart2}`);
});