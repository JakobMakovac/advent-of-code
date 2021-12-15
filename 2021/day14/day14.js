const fs = require('fs');

function addBigramToDict(dict, bigram, value) {
    if (!dict[bigram]) {
        dict[bigram] = value;
    } else {
        dict[bigram] += value;
    }
}

function addCharCount(charsByCount, char, value) {
    if (!charsByCount[char]) {
        charsByCount[char] = value;
    } else {
        charsByCount[char] += value;
    }
}

function buildInitialDict(initialState, charsByCount) {
    let out = {};

    for (var i = 0; i < initialState.length - 1; i++) {
        let bigram = initialState.slice(i, i + 2);
        addBigramToDict(out, bigram, 1);

        if (i === 0) {
            addCharCount(charsByCount, bigram[0], 1);
        }

        addCharCount(charsByCount, bigram[1], 1);
    }

    return out;
}

function polymerize(bigramsByCount, charsByCount, template) {
    let newDict = {};

    for (const [bigram, amount] of Object.entries(bigramsByCount)) {
        let left = bigram[0];
        let middle = template[bigram];
        let right = bigram[1];

        addCharCount(charsByCount, middle, amount);
        addBigramToDict(newDict, left + middle, amount);
        addBigramToDict(newDict, middle + right, amount);
    }

    return newDict;
}

function getAnswer(charsByCount) {
    var sortedCounts = Object.values(charsByCount).sort((a, b) => {
        return (+a) - (+b);
    });

    return sortedCounts[sortedCounts.length - 1] - sortedCounts[0];
}

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let lines = data.split('\r\n');

    var initialPolymer = lines[0];
    var polySteps = 40;
    var template = {};
    var charsByCount = {};
    var part1Answer = 0;
    var part2Answer = 0;

    for (const line of lines.slice(2)) {
        let lineParts = line.split(' -> ');
        template[lineParts[0]] = lineParts[1];
    }

    let bigramsByCount = buildInitialDict(initialPolymer, charsByCount);
    
    for (var i = 0; i < polySteps; i++) {
        bigramsByCount = polymerize(bigramsByCount, charsByCount, template);

        if (i === 9) {
            part1Answer = getAnswer(charsByCount);
        }
    }

    part2Answer = getAnswer(charsByCount);

    console.log(`Solution for Part One: ${part1Answer}`);
    console.log(`Solution for Part Two: ${part2Answer}`);
});