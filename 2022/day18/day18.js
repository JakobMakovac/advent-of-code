const FileReader = require('../common/file-reader');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

function addCube(x, y, z, state) {
    state[generateKey(x, y, z)] = 1;
}

function generateKey(x, y, z) {
    return `${x}-${y}-${z}`;
}

function parseKey(key) {
    return key.split('-').map((coordinate) => parseInt(coordinate));
}

function countNewEdges(x, y, z, state) {
    var sum = 0;

    for (const key of generateNeighbours(x, y, z)) {
        sum = state[key] ? sum + 1 : sum;
    }

    return sum;
}

function generateNeighbours(x, y, z) {
    const out = [];

    // Top and bottom face
    out.push(generateKey(x, y, z - 1));
    out.push(generateKey(x, y, z + 1));

    // Left and right face
    out.push(generateKey(x - 1, y, z));
    out.push(generateKey(x + 1, y, z));

    // Front and back face
    out.push(generateKey(x, y - 1, z));
    out.push(generateKey(x, y + 1, z));

    return out;
}

function findPockets(bounds, state) {
    var pockets = [];

    for (var x = 0; x < bounds.x; x++) {
        for (var y = 0; y < bounds.y; y++) {
            for (var z = 0; z < bounds.z; z++) {
                const stateKey = generateKey(x, y, z);
                if (state[stateKey]) {
                    continue;
                } else if (isinternal2(x, y, z, state, bounds)) {
                    pockets.push(stateKey);
                }
            }
        }
    }

    return pockets;
}

function isinternal2(x, y, z, state, bounds) {
    // Left
    for (var i = x - 1; i >= -1; i--) {
        if (state[generateKey(i, y, z)]) {
            break;
        }
        if (i === -1) {
            return false;
        }
    }
    // Right
    for (var i = x + 1; i <= bounds.x; i++) {
        if (state[generateKey(i, y, z)]) {
            break;
        }
        if (i === bounds.x) {
            return false;
        }
    }
    // Back
    for (var i = y + 1; i <= bounds.y; i++) {
        if (state[generateKey(x, i, z)]) {
            break;
        }
        if (i === bounds.y) {
            return false;
        }
    }
    // Front
    for (var i = y - 1; i >= -1; i--) {
        if (state[generateKey(x, i, z)]) {
            break;
        }
        if (i === -1) {
            return false;
        }
    }
    // Up
    for (var i = z + 1; i <= bounds.z; i++) {
        if (state[generateKey(x, y, i)]) {
            break;
        }
        if (i === bounds.z) {
            return false;
        }
    }
    // Down
    for (var i = z - 1; i >= -1; i--) {
        if (state[generateKey(x, y, i)]) {
            break;
        }
        if (i === -1) {
            return false;
        }
    }

    return true;
}

function countHiddenSides(pockets, state) {
    var count = 0;
    while (pockets.length > 0)  {
        const nextToCheck = parseKey(pockets.shift());
        const neighbours = generateNeighbours(...nextToCheck);
        for (const n of neighbours) {
            count = state[n] ? count + 1 : count;
        }
    }

    return count;
}

const state = {};
const bounds = { 'x': 0, 'y': 0, 'z': 0};
var edges = 0;
var cubes = 0;

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);

for (const cube of data) {
    const [x, y, z] = cube.split(',').map((coordinate) => parseInt(coordinate));
    bounds.x = Math.max(bounds.x, x);
    bounds.y = Math.max(bounds.y, y);
    bounds.z = Math.max(bounds.z, z);
    addCube(x, y, z, state);
    edges += countNewEdges(x, y, z, state);
    cubes ++;
}

const pockets = findPockets(bounds, state);
const hiddenSides = countHiddenSides(pockets, state);

console.log((cubes * 6) - (edges * 2) - hiddenSides);
