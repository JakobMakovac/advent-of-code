const FileReader = require('../common/file-reader');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

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

console.log((cubes * 6) - (edges * 2) - hiddenSides);
