const fs = require('fs');

class PowerModule {
    constructor (numberOfDigits) {
        this.dataLines = [];
        this.epsilonRate = '';
        this.gammaRate = '';
        this.co2ScrubRating = '';
        this.oxGenRating = '';
        this.occurencesPerDigit = new Array(numberOfDigits).fill(0);
        this.totalInputs = 0;
    }

    addInputLine(line) {
        for (var i = 0; i < line.length; i++) {
            this.occurencesPerDigit[i] += parseInt(line[i]);
        }

        this.dataLines.push(line);
        this.totalInputs++;
    }

    getCO2ScrubberRating(lines, index) {
        if (lines.length === 1) {
            return lines[0];
        }

        var splitLines = [[], []];
        var nextIterSplitLines;

        for (var i = 0; i < lines.length; i++) {
            splitLines[parseInt(lines[i][index])].push(lines[i]);
        }

        if (splitLines[0].length === 0) {
            nextIterSplitLines = splitLines[1];
        } else if (splitLines[1].length === 0) {
            nextIterSplitLines = splitLines[0];
        } else if (splitLines[0].length > splitLines[1].length) {
            nextIterSplitLines = splitLines[1];
        } else if (splitLines[0].length < splitLines[1].length) {
            nextIterSplitLines = splitLines[0];
        } else {
            nextIterSplitLines = splitLines[0];
        }

        return this.getCO2ScrubberRating(nextIterSplitLines, ++index);
    }

    getOxygenGeneratorRating(lines, index) {
        if (lines.length === 1) {
            return lines[0];
        }

        var splitLines = [[], []];
        var nextIterSplitLines;

        for (var i = 0; i < lines.length; i++) {
            splitLines[parseInt(lines[i][index])].push(lines[i]);
        }

        if (splitLines[0].length === 0) {
            nextIterSplitLines = splitLines[1];
        } else if (splitLines[1].length === 0) {
            nextIterSplitLines = splitLines[0];
        } else if (splitLines[0].length < splitLines[1].length) {
            nextIterSplitLines = splitLines[1];
        } else if (splitLines[0].length > splitLines[1].length) {
            nextIterSplitLines = splitLines[0];
        } else {
            nextIterSplitLines = splitLines[1];
        }

        return this.getOxygenGeneratorRating(nextIterSplitLines, ++index);
    }

    calculateRatings() {
        this.co2ScrubRating = this.getCO2ScrubberRating(this.dataLines, 0);
        this.oxGenRating = this.getOxygenGeneratorRating(this.dataLines, 0);
    }

    calculateRates() {
        var epsRateBinParts = [];
        var gamRateBinParts = [];

        for (var i = 0; i < this.occurencesPerDigit.length; i++) {
            gamRateBinParts[i] = ((this.occurencesPerDigit[i] < (this.totalInputs / 2)) ? 0 : 1);
            epsRateBinParts[i] = ((this.occurencesPerDigit[i] < (this.totalInputs / 2)) ? 1 : 0);
        }

        this.epsilonRate = epsRateBinParts.join('');
        this.gammaRate = gamRateBinParts.join('');
    }

    getPowerConsumption() {
        this.calculateRates();

        return parseInt(this.gammaRate, 2) * parseInt(this.epsilonRate, 2);
    }

    getLifeSupportRating() {
        this.calculateRatings();

        return parseInt(this.co2ScrubRating, 2) * parseInt(this.oxGenRating, 2);
    }
}

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let dataReadings = data.split('\r\n');

    let powerModule = new PowerModule(dataReadings[0].length);
    
    for (var i = 0; i < dataReadings.length; i++) {
        powerModule.addInputLine(dataReadings[i]);
    }

    console.log(powerModule.getPowerConsumption());
    console.log(powerModule.getLifeSupportRating());
});