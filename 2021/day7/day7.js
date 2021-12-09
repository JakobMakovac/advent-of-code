const fs = require('fs');
const ExercisePart = {
    'PART1': 'p1',
    'PART2': 'p2'
};

function groupPositions(positions) {
    let out = {};

    for (pos of positions) {
        if (!out[pos]) {
            out[pos] = 1;
        } else {
            out[pos] ++;
        }
    }

    return out;
}

function doBisection(groupedPositions, currentPoint, diff, exPart) {
    let currentValue = calculateValue(groupedPositions, currentPoint, exPart);
    
    if (diff === 0) {
        return currentValue;
    }

    let upValue = calculateValue(groupedPositions, currentPoint + diff, exPart);
    let downValue = calculateValue(groupedPositions, currentPoint - diff, exPart);
    let nextDiff = parseInt(diff / 2);

    if (upValue < currentValue) {
        return doBisection(groupedPositions, parseInt(currentPoint + diff), nextDiff, exPart);
    } else if (downValue < currentValue) {
        return doBisection(groupedPositions, parseInt(currentPoint - diff), nextDiff, exPart);
    } else {
        return doBisection(groupedPositions, currentPoint, nextDiff, exPart);
    }
}

function calculateValue(groupedPositions, _value, exPart) {
    var fuel = 0;

    for (const [key, value] of Object.entries(groupedPositions)) {
        let diff = Math.abs(_value - parseInt(key));
        if (exPart === ExercisePart.PART1) {
            fuel += value * diff;
        } else {
            fuel += value * ((diff * (diff + 1)) / 2);
        }
    }
    
    return fuel;
}

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let highestValue = 0;

    let positions = data.split(',').map((d) => {
        let _curValue = parseInt(d);
        
        if (_curValue > highestValue) {
            highestValue = _curValue;
        }

        return _curValue;
    });
    
    let groupedPositions = groupPositions(positions);

    console.log(`Solution for Part One: ${doBisection(groupedPositions, parseInt(highestValue / 2), parseInt(highestValue / 4), ExercisePart.PART1)}`);
    console.log(`Solution for Part Two: ${doBisection(groupedPositions, parseInt(highestValue / 2), parseInt(highestValue / 4), ExercisePart.PART2)}`);
});