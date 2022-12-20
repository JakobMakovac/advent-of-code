const FileReader = require('../common/file-reader');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const resultSymbolMap = {
    'A': {
        'X': 'C',
        'Y': 'A',
        'Z': 'B',
    },
    'B': {
        'X': 'A',
        'Y': 'B',
        'Z': 'C',
    },
    'C': {
        'X': 'B',
        'Y': 'C',
        'Z': 'A',
    },
}

const symbolValue = {
    'A': 1,
    'B': 2,
    'C': 3
}

const gameOutcomes = {
    'X': 0,
    'Y': 3,
    'Z': 6
}

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);

var totalSum = 0;

data.forEach(line => {
    const symbolsPlayed = line.split(' ');
    const opponentSymbol = symbolsPlayed[0];
    const gameOutcome = symbolsPlayed[1];
    const playerSymbol = resultSymbolMap[opponentSymbol][gameOutcome];
    totalSum = totalSum + gameOutcomes[gameOutcome] + symbolValue[playerSymbol];
});

console.log(`Total score: ${totalSum}`);