const fs = require('fs');

class Octopus {
    constructor (x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    increaseValue() {
        this.value ++;
    }

    resetValue() {
        this.value = 0;
    }

    willFlash() {
        return this.value > 9;
    }

    isNewFlash() {
        return this.value === 10;
    }
}

function performSimStep(map) {
    let flashNodes = [];
    let flashes = 0;

    // Increase all values by 1
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            let currentOcto = map[i][j];
            currentOcto.increaseValue();
            if (currentOcto.willFlash()) {
                flashNodes.push(currentOcto);
            }
        }
    }

    // Increase value for neighbours of flash nodes
    while (flashNodes.length > 0) {
        let curNode = flashNodes.pop();
        let neighbourNodes = getNeighbours(curNode, map).filter((n) => !n.willFlash());

        let newFlashNodes = neighbourNodes.filter((node) => {
            node.increaseValue();
            return node.isNewFlash();
        });

        flashNodes.push(...newFlashNodes);
    }

    // Count flashes and reset values
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            let currentOcto = map[i][j];
            if (currentOcto.willFlash()) {
                flashes ++;
                currentOcto.resetValue();
            }
        }
    }

    return flashes;
}

function getNeighbours(node, map) {
    let out = [];

    if (node.x > 0) {
        // Left node
        out.push(map[node.y][node.x - 1]);

        // Top Left node
        if (node.y > 0) {
            out.push(map[node.y - 1][node.x - 1]);
        }
        // Bottom Left node
        if (node.y < map.length - 1) {
            out.push(map[node.y + 1][node.x - 1]);
        }
    }
    if (node. x < map[0].length - 1) {
        // Right node
        out.push(map[node.y][node.x + 1]);

        // Top Right node
        if (node.y > 0) {
            out.push(map[node.y - 1][node.x + 1]);
        }
        // Bottom Right node
        if (node.y < map.length - 1) {
            out.push(map[node.y + 1][node.x + 1]);
        }
    }
    if (node.y > 0) {
        // Top node
        out.push(map[node.y - 1][node.x]);
    }
    if (node.y < map.length - 1) {
        // Bottom node
        out.push(map[node.y + 1][node.x]);
    }

    return out;
}

fs.readFile('E:/workspace/advent-of-code/2021/day11/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let rows = data.split('\r\n');
    let octoMap = new Array(rows.length).fill(0).map(() => new Array(rows[0].length).fill(0));

    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < rows[0].length; j++) {
            octoMap[i][j] = new Octopus(j, i, parseInt(rows[i][j]));
        } 
    }

    let octosNumber = rows.length * rows[0].length;
    let totalFlashes = 0;
    let part2Answer = 0;
    let step = 0;

    while (true) {
        let stepFlashes = performSimStep(octoMap);

        if (step < 100) {
            totalFlashes += stepFlashes;
        } else if (part2Answer !== 0) {
            break;
        }

        if (stepFlashes === octosNumber && part2Answer === 0) {
            part2Answer = step + 1;
            if (step >= 100) {
                break;
            }
        }

        step ++;
    }

    console.log(`Solution for Part One: ${totalFlashes}`);
    console.log(`Solution for Part Two: ${part2Answer}`);
});
