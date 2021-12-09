const fs = require('fs');

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let dataPoints = data.split('\r\n');
    let previousValue = parseInt(dataPoints[0]);
    let previousSum = 0;
    let numberOfIncreases = 0;
    let numberOfSumIncreases = 0;

    // Part One
    for (var i = 1; i < dataPoints.length; i++) {
        currentValue = parseInt(dataPoints[i]);

        if (currentValue > previousValue) {
            numberOfIncreases ++;
        }

        previousValue = currentValue;
    }
    
    // Part Two
    for (var i = 0; i < dataPoints.length - 2; i++) {
        currentSum = parseInt(dataPoints[i]) + parseInt(dataPoints[i + 1]) + parseInt(dataPoints[i + 2]);

        if (i > 0 && currentSum > previousSum) {
            numberOfSumIncreases ++;
        }

        previousSum = currentSum;
    }

    console.log(`Solution for Part One: ${numberOfIncreases}`);
    console.log(`Solution for Part Two: ${numberOfSumIncreases}`);
});
