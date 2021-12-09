const fs = require('fs');

function groupFishByAge(fish) {
    let output = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        'total': 0
    };

    for (f of fish) {
        output[f] ++;
        output['total'] ++;
    }

    return output;
}

function performSimulation(currentState, returnResultsAt) {
    let output = {};

    for (var i = 0; i < 256; i ++) {
        performSimStep(currentState);
        if (returnResultsAt.includes(i + 1)) {
            output[i + 1] = currentState.total;
        }
    }

    return output;
}

function performSimStep(fishByAge) {
    var newFish = fishByAge[0];

    for (var i = 0; i <= 7; i++) {
        fishByAge[i] = fishByAge[(i + 1)];
    }

    fishByAge[6] += newFish;
    fishByAge[8] = newFish;
    fishByAge['total'] += newFish;
}

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let lanternFish = data.split(',').map((d) => parseInt(d));
    let initialState = groupFishByAge(lanternFish);
    let returnResultAtSteps = [80, 256];

    let results = performSimulation(initialState, returnResultAtSteps);

    console.log(`Solution for Part One: ${results[80]}`);
    console.log(`Solution for Part Two: ${results[256]}`);
});