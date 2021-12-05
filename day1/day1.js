const fs = require('fs');

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let dataPoints = data.split('\r\n');
    let previousSum = 0
    let numberOfIncreases = 0;
    
    for (var i = 0; i < dataPoints.length - 2; i++) {
        currentSum = parseInt(dataPoints[i]) + parseInt(dataPoints[i + 1]) + parseInt(dataPoints[i + 2]);

        if (i > 0 && currentSum > previousSum) {
            numberOfIncreases ++;
        }

        previousSum = currentSum;
    }

    console.log(numberOfIncreases);
});
