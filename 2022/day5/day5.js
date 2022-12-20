const FileReader = require('../common/file-reader');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);

var stacks = 0;

data.forEach(line => {
    const areStacks = line.includes('[');
    const areMoveInstructions = line.includes('move');
    if (stacks === 0) {
        stacks = new Array((line.length + 1) / 4).map((i) => new Array(1));
    }

    if (areStacks) {
        for (var i = 0; i < (line.length + 1) / 4; i++) {
            var nextChar = line.substring((i*4), (i*4)+3).replace('[', '').replace(']', '').trim();
            if (!!nextChar) {
                if (!stacks[i]) {
                    stacks[i] = [];
                }
                stacks[i].push(nextChar);
            }
        }
    }

    if (areMoveInstructions) {
        const instructions = line.replace('move ', '').replace(' from ', ' ').replace(' to ', ' ').split(' ').map((char) => parseInt(char));
        const [moves, from, to] = instructions;

        const elementsToMove = [];
        for (var i = 0; i < moves; i++) {
            elementsToMove.push(stacks[from - 1].shift());
        }
        stacks[to - 1].unshift(...elementsToMove);
    }
});

console.log(`Message: ${stacks.map((substack) => substack[0]).join('')}`);