const fs = require('fs');

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function markBasinNodes(node, heightMap, basinMap, basinId) {
    let nodesToCheck = [node];
    
    while (nodesToCheck.length > 0) {
        let currentNode = nodesToCheck.shift();
        if (heightMap[currentNode.y][currentNode.x] === 9 || basinMap[currentNode.y][currentNode.x] >= 0) {
            continue;
        }

        basinMap[currentNode.y][currentNode.x] = basinId;

        // Add top node
        if (currentNode.y > 0) {
            nodesToCheck.push(new Node(currentNode.x, currentNode.y - 1));
        }
        // Add bottom node
        if (currentNode.y < heightMap.length - 1) {
            nodesToCheck.push(new Node(currentNode.x, currentNode.y + 1));
        }
        // Add left node
        if (currentNode.x > 0) {
            nodesToCheck.push(new Node(currentNode.x - 1, currentNode.y));
        }
        // Add right node
        if (currentNode.x < heightMap[0].length - 1) {
            nodesToCheck.push(new Node(currentNode.x + 1, currentNode.y));
        }
    }
}

function countBasinSizes(map) {
    let out = {};

    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            let basinId = map[i][j];
            if (basinId < 0) {
                continue;
            }

            if (!out[basinId]) {
                out[basinId] = 1;
            } else {
                out[basinId] ++;
            }
        }
    }

    return out;
}

fs.readFile('E:/workspace/advent-of-code-2021/day9/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let heightMap = data.split('\r\n').map((line) => {
        return line.split('').map((char) => parseInt(char));
    });

    let basinMap = new Array(heightMap.length).fill(-1).map(() => new Array(heightMap[0].length).fill(-1));

    let lowPoints = [];
    let total = 0;

    for (var i = 0; i < heightMap.length; i++) {
        var row = heightMap[i];
        for (var j = 0; j < row.length; j++) {
            let top = (i === 0 ? 10 : heightMap[i - 1][j]);
            let right = (j === row.length - 1 ? 10 : row[j + 1]);
            let bottom = (i === heightMap.length - 1 ? 10 : heightMap[i + 1][j]);
            let left = (j === 0 ? 10 : row[j - 1]);

            if (row[j] < top && row[j] < right && row[j] < bottom && row[j] < left) {
                total += (row[j] + 1);
                lowPoints.push(new Node(j, i));
            }
        }
    }

    let nextBasinId = 0;

    for (const lowPoint of lowPoints) {
        markBasinNodes(lowPoint, heightMap, basinMap, nextBasinId);
        nextBasinId ++;
    }

    let basinSizesById = countBasinSizes(basinMap);

    let result = Object.values(basinSizesById).sort((a, b) => {
        return (+b) - (+a);
    }).slice(0, 3).reduce((prev, next) => {
        return prev * next;
    }, 1)


    console.log(`Solution for Part One: ${total}`);
    console.log(`Solution for Part Two: ${result}`);
});