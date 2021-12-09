const fs = require('fs');

class DisplayParser {
    constructor(signals, occurencesBySymbol) {
        this.signalsOccurence = occurencesBySymbol;
        this.digitsBySize = {};
        this.symbolsByPosition = {};
        this.parseInitSignals(signals);
        this.calculateSymbols();
    }

    parseInitSignals(signals) {
        for (const signal of signals) {
            var s = new Digit(signal);
            this.digitsBySize[s.numberOfSegs] = s;
        }
    }

    calculateSymbols() {
        let twoDigitSym = this.digitsBySize['2'];
        let symbols = twoDigitSym.getSymbols();
        if (this.signalsOccurence[symbols[0]] === 8) {
            this.symbolsByPosition['tr'] = symbols[0];
            this.symbolsByPosition['br'] = symbols[1];
        } else {
            this.symbolsByPosition['tr'] = symbols[1];
            this.symbolsByPosition['br'] = symbols[0];
        }

        let threeDigitSym = this.digitsBySize['3'];
        let diff = threeDigitSym.difference(twoDigitSym);
        this.symbolsByPosition['top'] = diff[0];

        let fourDigitSystem = this.digitsBySize['4'];
        diff = fourDigitSystem.difference(twoDigitSym);
        if (this.signalsOccurence[diff[0]] === 7) {
            this.symbolsByPosition['mid'] = diff[0];
            this.symbolsByPosition['tl'] = diff[1];
        } else {
            this.symbolsByPosition['mid'] = diff[1];
            this.symbolsByPosition['tl'] = diff[0];
        }

        let sevenDigitSystem = this.digitsBySize['7'];
        diff = sevenDigitSystem.difference(new Digit(`${this.symbolsByPosition['top']}${this.symbolsByPosition['tr']}${this.symbolsByPosition['tl']}${this.symbolsByPosition['mid']}${this.symbolsByPosition['br']}`));
    
        if (this.signalsOccurence[diff[0]] === 7) {
            this.symbolsByPosition['bot'] = diff[0];
            this.symbolsByPosition['bl'] = diff[1];
        } else {
            this.symbolsByPosition['bot'] = diff[1];
            this.symbolsByPosition['bl'] = diff[0];
        }
    }

    getOutputNumberFromSegments(segments) {
        let out = '';
        for (const seg of segments) {
            switch (seg.length) {
                case 2:
                    out += '1';
                    break;
                case 3:
                    out += '7';
                    break;
                case 4:
                    out += '4';
                    break;
                case 5:
                    if (seg.indexOf(this.symbolsByPosition['bl']) >= 0) {
                        out += '2';
                    } else if (seg.indexOf(this.symbolsByPosition['tl']) >= 0) {
                        out += '5';
                    } else {
                        out += '3';
                    }
                    break;
                case 6:
                    if (seg.indexOf(this.symbolsByPosition['mid']) < 0) {
                        out += '0';
                    } else if (seg.indexOf(this.symbolsByPosition['bl']) < 0) {
                        out += '9';
                    } else {
                        out += '6';
                    }
                    break;
                case 7:
                    out += '8';
                    break;
            }
        }

        return out;
    }
}

class Digit {
    constructor(signal) {
        this.segments = new Set(signal.split(''));
        this.numberOfSegs = this.segments.size;
    }

    difference(digit) {
        if (this.segments.size > digit.segments.size) {
            return [...this.segments].filter(segment => !digit.segments.has(segment));
        } else {
            return [...digit.segments].filter(segment => !this.segments.has(segment));
        }
    }

    getSymbols() {
        return [...this.segments];
    }
}

function countOccurences(data) {
    var symbols = data.split('');
    var occurences = {};
    for (const s of symbols) {
        if (s === '') {
            return;
        } else if (!occurences[s]) {
            occurences[s] = 1;
        } else {
            occurences[s] ++;
        }
    }

    return occurences;
}

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    var inputLines = data.split('\r\n');
    var totalPart1 = 0;
    var totalPart2 = 0;

    for (var i = 0; i < inputLines.length; i++) {
        var _data = inputLines[i].split('|');
        var occurencesBySymbol = countOccurences(_data[0]);
        var signals = _data[0].trim().split(' ');
        var output = _data[1].trim().split(' ');

        totalPart1 += output.reduce((acc, input) => {
            if (input.length === 2 || input.length === 3 || input.length === 4 || input.length === 7) {
                return acc + 1;
            } else {
                return acc;
            }
        }, 0);

        var parser = new DisplayParser(signals, occurencesBySymbol);
        totalPart2 += parseInt(parser.getOutputNumberFromSegments(output));
    }

    console.log(`Solution for Part One: ${totalPart1}`);
    console.log(`Solution for Part Two: ${totalPart2}`);
});