const FileReader = require('../common/file-reader');
const { CPU } = require('./cpu');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);

const cpu = new CPU();

for (var i = 0; i < data.length; i++) {
    var instruction, value;
    [instruction, value] = data[i].split(' ');
    value = parseInt(value);
    cpu.executeOp(instruction, value);
}

console.log(cpu.totalSignalStrength);
cpu.screen.map((row) => console.log(row.join('')));
