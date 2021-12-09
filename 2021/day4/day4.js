const fs = require('fs');

class BingoBoard {
    constructor(lines) {
        this.winningState = false;
        this.fields = {};
        this.rowHits = {};
        this.columnHits = {};
        this.initLines(lines);
    }

    initLines(lines) {
        if (lines.length !== 5) {
            console.error('Need 5 lines for bingo board.');
        }

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim().split(/[ ]+/);

            if (line.length !== 5) {
                console.error('Need 5 entries in line for bingo board.');
            }
            for (var j = 0; j < line.length; j++) {
                this.fields[line[j]] = new BoardField(j, i, line[j]);
            }
        }
    }

    markNumber(value) {
        var field = this.fields[value];

        if (field) {
            field.mark();
            this.markHits(field.row, field.column);
        }
    }

    markHits(row, column) {
        if (!this.rowHits[row]) {
            this.rowHits[row] = 1;
        } else if (this.rowHits[row] === 4) {
            this.winningState = true;
            this.rowHits[row] ++;
        } else {
            this.rowHits[row] ++;
        }

        if (!this.columnHits[column]) {
            this.columnHits[column] = 1;
        } else if (this.columnHits[column] === 4) {
            this.winningState = true;
            this.columnHits[column] ++;
        } else {
            this.columnHits[column] ++;
        }
    }

    hasWinningState() {
        return this.winningState;
    }

    calculateScore(lastNumber) {
        var total = 0;

        for (const [key, value] of Object.entries(this.fields)) {
            if (!value.isMarked) {
                total += parseInt(value.value);
            }
        }

        return parseInt(lastNumber) * total;
    }
}

class BoardField {
    constructor(xPos, yPos, value) {
        this.column = xPos;
        this.row = yPos;
        this.isMarked = false;
        this.value = value;
    }

    mark() {
        this.isMarked = true;
    }
}

function findFirstBoardToWin(boards, playNumbers) {
    var hasWinningBoard = false;
    var winningBoardIndex;
    var winningNumber;

    while (!hasWinningBoard) {
        playNumbersLoop:
        for (var i = 0; i < playNumbers.length; i++) {
            boardsLoop:
            for (var j = 0; j < boards.length; j++) {
                boards[j].markNumber(playNumbers[i]);
                if (boards[j].hasWinningState()) {
                    winningBoardIndex = j;
                    winningNumber = playNumbers[i];
                    hasWinningBoard = true;
                    break playNumbersLoop;
                }
            }
        }
    }

    return boards[winningBoardIndex].calculateScore(winningNumber);
}

function findLastBoardToWin(boards, playNumbers) {
    var winningNumber;

    while (boards.length > 0 && !winningNumber) {
        playNumbersLoop:
        for (var i = 0; i < playNumbers.length; i++) {
            boardsLoop:
            for (var j = 0; j < boards.length; j++) {
                boards[j].markNumber(playNumbers[i]);
            }
            
            if (boards.length === 1 && boards[0].hasWinningState()) {
                winningNumber = playNumbers[i];
                break playNumbersLoop;
            }

            boards = boards.filter((board) => {
                return !board.hasWinningState();
            });
            
        }
    }

    return boards[0].calculateScore(winningNumber);
}

function initBoards(inputLines) {
    let out = [];

    for (var i = 1; i < inputLines.length; i++) {
        out.push(new BingoBoard(inputLines[i].split('\r\n')));
    }

    return out;
}

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    var inputLines = data.split('\r\n\r\n');
    var playNumbers = inputLines[0].split(',');
    var boards = initBoards(inputLines);

    console.log(`Solution for Part One: ${findFirstBoardToWin(boards, playNumbers)}`);

    var boards = initBoards(inputLines);

    console.log(`Solution for Part Two: ${findLastBoardToWin(boards, playNumbers)}`);
});
