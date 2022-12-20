const FileReader = require('../common/file-reader');
const { Monkey } = require('./monkey');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);
const rounds = 10000;
const monkeys = [];
var monkeyIndex = 0;
var divisionTest = 0;
var truePath = 0;
var falsePath = 0;
var totalDivisionTest = BigInt(1);

for (var i = 0; i < data.length; i++) {
    if (data[i].startsWith('Monkey')) {
        monkeyIndex = data[i].replace(':', '').split(' ')[1];
        monkeys[monkeyIndex] = new Monkey();
    } else if (data[i].includes('Starting items')) {
        const startingItems = data[i].replace('  Starting items: ', '').split(', ').map((x) => BigInt(x));
        monkeys[monkeyIndex].setStartingItems(startingItems);
    } else if (data[i].includes('Operation')) {
        [operand1, operator, operand2] = data[i].replace('  Operation: new = ', '').split(' ');
        operand1 = isNaN(parseInt(operand1)) ? operand1 : `BigInt(${operand1})`;
        operand2 = isNaN(parseInt(operand2)) ? operand2 : `BigInt(${operand2})`;
        monkeys[monkeyIndex].setOperation(Function('old', `return ${operand1} ${operator} ${operand2}`));
    } else if (data[i].includes('Test:')) {
        lineParts = data[i].split(' ');
        divisionTest = BigInt(lineParts[lineParts.length - 1]);
        totalDivisionTest *= divisionTest;
    } else if (data[i].includes('If true: ')) {
        truePath = parseInt(data[i][data[i].length - 1]);
    } else if (data[i].includes('If false: ')) {
        falsePath = parseInt(data[i][data[i].length - 1]);
        monkeys[monkeyIndex].setTest(
            Function('input', `return input % BigInt(${divisionTest}) === BigInt(0) ? ${truePath} : ${falsePath}`)
        );
    }
}

for (var i = 0; i < rounds; i++) {
    for (var m = 0; m < monkeys.length; m++) {
        const monkey = monkeys[m];
        while(monkey.items.length > 0) {
            const item = monkey.getNextItem();
            const newValue = monkey.operation(item) % totalDivisionTest;
            monkeys[monkey.test(newValue)].addItem(newValue);
        }
    }
}

var inspections = monkeys.map((m) => m.inspections).sort((a, b) => b - a);
console.log(inspections);
console.log(inspections[0] * inspections[1]);
